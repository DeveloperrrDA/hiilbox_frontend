import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import {
  apiBase,
  growfundJson,
  requireUser,
} from "@/app/api/dashboard/campaigns/_server";
import { isAdminUser } from "@/app/api/dashboard/_owned";

async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).growfund_db;
    const cache = (env as any).HIILBOX_CACHE as
      | {
          get(key: string): Promise<string | null>;
          put(key: string, value: string, options: { expirationTtl: number }): Promise<void>;
        }
      | undefined;

    // 1. Check KV cache for verified admin status to skip the 5s WordPress /auth/me round-trip
    const tokenHash = await hashToken(auth.authorization);
    const authCacheKey = `admin:auth:${tokenHash}`;
    let isAdministrator = false;

    if (cache) {
      const cachedAuth = await cache.get(authCacheKey).catch(() => null);
      if (cachedAuth === "1") {
        isAdministrator = true;
      }
    }

    if (!isAdministrator) {
      const me: any = await growfundJson(`${apiBase}/auth/me`, {
        headers: { Authorization: auth.authorization },
      });

      if (!me.response.ok) {
        return NextResponse.json(me.data, { status: me.response.status });
      }

      const capabilities = me.data?.data?.wpbt_capabilities;
      isAdministrator =
        isAdminUser(me.data) ||
        (Array.isArray(capabilities) &&
          capabilities.some(
            (value: unknown) =>
              typeof value === "string" &&
              /(?:^|[;{])s:13:"administrator";b:1;/.test(value)
          ));

      if (!isAdministrator) {
        return NextResponse.json(
          { message: "Administrator access required." },
          { status: 403 }
        );
      }

      if (cache) {
        await cache.put(authCacheKey, "1", { expirationTtl: 300 }).catch(() => {});
      }
    }

    // 2. D1 EDGE INTERCEPT: Read pre-calculated total_payable from metadata table
    if (db) {
      try {
        const metaRow = await db
          .prepare(`SELECT value, last_synced_at FROM metadata WHERE key = 'total_payable' LIMIT 1`)
          .first();

        if (metaRow && metaRow.value !== null && metaRow.value !== undefined) {
          const parsedTotal = Number(metaRow.value);
          if (Number.isFinite(parsedTotal)) {
            const countRow = await db
              .prepare(`SELECT COUNT(*) as total FROM fundraisers`)
              .first();

            return NextResponse.json(
              {
                success: true,
                total_payable: Math.round(parsedTotal * 100) / 100,
                fundraiser_count: Number(countRow?.total || 0),
                last_synced_at: metaRow.last_synced_at,
              },
              {
                status: 200,
                headers: {
                  "Cache-Control": "private, no-store",
                  "X-Hiilbox-Source": "D1-Edge",
                },
              }
            );
          }
        }
      } catch (d1Err) {
        console.error("D1 total-payable lookup failed, falling back to WP:", d1Err);
      }
    }

    // 3. WORDPRESS FALLBACK (Only if D1 metadata is empty)
    const ids = new Set<number>();

    for (let page = 1; page <= 100; page++) {
      const q = new URLSearchParams({ page: String(page), per_page: "100" });
      const result = await growfundJson(`${apiBase}/fundraisers/paginated?${q}`, {
        headers: { Authorization: auth.authorization },
      });

      if (!result.response.ok) {
        return NextResponse.json(result.data, { status: result.response.status });
      }

      const data: any = result.data;
      const batch =
        data?.data?.results ??
        data?.data?.data ??
        data?.data?.items ??
        data?.data ??
        data?.results ??
        [];

      if (!Array.isArray(batch)) throw new Error("Unexpected fundraiser response.");

      for (const person of batch) {
        const id = Number(person?.id ?? person?.user_id ?? person?.fundraiser_id);
        if (id > 0) ids.add(id);
      }

      if (batch.length < 100) break;
    }

    let total = 0;
    const fundraiserIds = [...ids];
    for (let i = 0; i < fundraiserIds.length; i += 10) {
      const batch = fundraiserIds.slice(i, i + 10);
      const amounts = await Promise.all(
        batch.map(async (id) => {
          const result: any = await growfundJson(
            `${apiBase}/fundraiser/wallet/info?fundraiser_id=${id}`,
            { headers: { Authorization: auth.authorization } }
          );
          if (!result.response.ok) {
            throw new Error(`Wallet lookup failed for fundraiser ${id}.`);
          }
          const value = Number(result.data?.data?.available_withdraw_amount);
          if (!Number.isFinite(value) || value < 0) {
            throw new Error(`Invalid wallet balance for fundraiser ${id}.`);
          }
          return value;
        })
      );
      total += amounts.reduce((sum, amount) => sum + amount, 0);
    }

    return NextResponse.json(
      {
        success: true,
        total_payable: Math.round(total * 100) / 100,
        fundraiser_count: ids.size,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
          "X-Hiilbox-Source": "WP-Fallback",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to calculate Total Payable.",
      },
      { status: 500 }
    );
  }
}