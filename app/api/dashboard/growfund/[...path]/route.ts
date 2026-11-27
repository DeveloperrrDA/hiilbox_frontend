import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import {
  apiBase,
  combinedHeaders,
  getSystemToken,
  growfundJson,
  requireUser,
} from "@/app/api/dashboard/campaigns/_server";

const ALLOWED = [
  /^auth\/me$/,
  /^donations\/paginated$/,
  /^donation\/[A-Za-z0-9_-]+\/receipt$/,
  /^donation\/\d+\/update-status$/,
  /^fundraiser\/wallet\/info$/,
  /^fundraiser\/kyc$/,
  /^fundraiser\/withdrawal\/request\/create$/,
  /^fundraiser\/withdrawal\/requests\/paginated$/,
  /^fundraiser\/\d+\/update-payout-method$/,
  /^fundraiser\/\d+\/update$/,
  /^fundraiser\/\d+\/overview$/,
  /^fundraiser\/\d+\/activities$/,
  /^donor\/\d+\/overview$/,
  /^donor\/\d+\/activities$/,
  /^donor\/\d+\/donations$/,
];

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: "GET" | "POST"
) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  const { path } = await context.params;
  const backendPath = (path || []).join("/");

  if (!backendPath || !ALLOWED.some((p) => p.test(backendPath))) {
    return NextResponse.json(
      { success: false, message: "Unsupported dashboard endpoint." },
      { status: 404 }
    );
  }

  // =========================================================
  // ⚡ 1. D1 INTERCEPT: GET fundraiser/kyc (Scoped to userId)
  // =========================================================
  if (method === "GET" && backendPath === "fundraiser/kyc") {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const db = (env as any).growfund_db;

      if (db) {
        const row = await db
          .prepare(`SELECT * FROM fundraiser_kyc WHERE user_id = ? LIMIT 1`)
          .bind(auth.userId)
          .first();

        if (row) {
          return NextResponse.json(
            { success: true, data: row },
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
    } catch (err) {
      console.error("🔥 D1 dashboard fundraiser/kyc intercept error:", err);
    }

    // Fallback if user has no D1 row yet: query WP via system token and filter to auth.userId
    try {
      const sysToken = await getSystemToken();
      const { response, data } = await growfundJson(
        `${apiBase}/fundraiser/kyc?page=1&per_page=200`,
        {
          method: "GET",
          headers: combinedHeaders(sysToken),
        }
      );

      if (response.ok && Array.isArray((data as any)?.data)) {
        const match =
          (data as any).data.find(
            (r: any) => Number(r?.user_id) === Number(auth.userId)
          ) ?? {
            user_id: auth.userId,
            kyc_status: "pending",
            growfund_status: "pending",
          };
        return NextResponse.json({ success: true, data: match }, { status: 200 });
      }
    } catch (err) {
      console.error("🔥 WP fallback fundraiser/kyc error:", err);
    }

    // Safe empty state instead of 401 so the user is never logged out
    return NextResponse.json(
      {
        success: true,
        data: {
          user_id: auth.userId,
          kyc_status: "pending",
          growfund_status: "pending",
        },
      },
      { status: 200 }
    );
  }

  // =====================================================================
  // ⚡ 2. D1 INTERCEPT: GET fundraiser/:id/activities & donor/:id/activities
  // =====================================================================
  const activitiesMatch = backendPath.match(/^(fundraiser|donor)\/(\d+)\/activities$/);
  if (method === "GET" && activitiesMatch) {
    const kind = activitiesMatch[1] as "fundraiser" | "donor";
    const requestedId = Number(activitiesMatch[2]);

    if (requestedId !== auth.userId) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }

    try {
      const { env } = await getCloudflareContext({ async: true });
      const db = (env as any).growfund_db;

      if (db) {
        const sp = req.nextUrl.searchParams;
        const page = Math.max(1, Number(sp.get("page") || 1));
        const perPage = Math.min(100, Math.max(1, Number(sp.get("per_page") || 15)));
        const offset = (page - 1) * perPage;

        const safeParse = (val: any) => {
          if (!val || typeof val !== "string") return val ?? null;
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        };

        let whereSql = "";
        let bindings: any[] = [];

        if (kind === "donor") {
          whereSql = `
            WHERE a.user_id = ?
              AND LOWER(COALESCE(a.type, '')) IN ('donation-created', 'donation-completed', 'donation-cancelled', 'donation-failed')
          `;
          bindings = [auth.userId];
        } else {
          const { results: owned } = await db
            .prepare(`
              SELECT id FROM campaigns
              WHERE LOWER(COALESCE(status, '')) NOT IN ('trash', 'trashed')
                AND CAST(COALESCE(
                  NULLIF(json_extract(fundraiser, '$.id'), ''),
                  NULLIF(json_extract(author, '$.id'), '')
                ) AS INTEGER) = ?
            `)
            .bind(auth.userId)
            .all();

          const cids = (owned || []).map((c: any) => Number(c.id)).filter(Boolean);
          if (cids.length === 0) {
            return NextResponse.json(
              { success: true, data: [], total: 0, pagination: { page, per_page: perPage, total: 0, total_pages: 1 } },
              { status: 200, headers: { "X-Hiilbox-Source": "D1-Edge" } }
            );
          }

          whereSql = `WHERE a.campaign_id IN (${cids.map(() => "?").join(",")})`;
          bindings = [...cids];
        }

        const countRow = await db
          .prepare(`SELECT COUNT(*) as total FROM activities a ${whereSql}`)
          .bind(...bindings)
          .first();
        const total = Number(countRow?.total || 0);

        const { results } = await db
          .prepare(`
            SELECT a.*, c.title AS campaign_title
            FROM activities a
            LEFT JOIN campaigns c ON a.campaign_id = c.id
            ${whereSql}
            ORDER BY datetime(a.created_at) DESC, a.id DESC
            LIMIT ? OFFSET ?
          `)
          .bind(...bindings, perPage, offset)
          .all();

        const hydrated = (results || []).map((row: any) => ({
          ...row,
          data: safeParse(row.data),
          meta: safeParse(row.meta),
        }));

        return NextResponse.json(
          {
            success: true,
            data: hydrated,
            total,
            pagination: {
              page,
              per_page: perPage,
              total,
              total_pages: Math.max(1, Math.ceil(total / perPage)),
            },
          },
          { status: 200, headers: { "Cache-Control": "private, no-store", "X-Hiilbox-Source": "D1-Edge" } }
        );
      }
    } catch (err) {
      console.error("🔥 D1 dashboard activities intercept error:", err);
    }
  }

  // =========================================================
  // 3. PROXY TO WORDPRESS (With X-API-Key + 401 Session Guard)
  // =========================================================
  const target = new URL(`${apiBase}/${backendPath}`);
  req.nextUrl.searchParams.forEach((value, key) =>
    target.searchParams.append(key, value)
  );

  const apiKey =
    process.env.GROWFUND_CLIENT_API_KEY ||
    process.env.NEXT_PUBLIC_GROWFUND_CLIENT_API_KEY ||
    "";

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: auth.authorization,
  };
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  let body: string | undefined;
  if (method === "POST") {
    body = await req.text();
    if (body) {
      headers["Content-Type"] = req.headers.get("content-type") || "application/json";
    }
  }

  try {
    const { response, data } = await growfundJson(target.toString(), {
      method,
      headers,
      body: body || undefined,
    });

    // IMPORTANT: requireUser(req) ALREADY proved the user's JWT is valid!
    // Never return an upstream 401 as 401, otherwise the client will wipe the session and redirect to "/".
    const safeStatus = response.status === 401 ? 403 : response.status;

    return NextResponse.json(data, { status: safeStatus });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Dashboard request failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy(req, context, "GET");
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy(req, context, "POST");
}