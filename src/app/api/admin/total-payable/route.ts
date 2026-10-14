
import { NextRequest, NextResponse } from "next/server";
import {
  apiBase,
  growfundJson,
  requireUser,
} from "@/app/api/dashboard/campaigns/_server";
import { isAdminUser } from "@/app/api/dashboard/_owned";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  try {
    // Verify the user against WordPress, not just the local role.
    const me = await growfundJson(`${apiBase}/auth/me`, {
      headers: { Authorization: auth.authorization },
    });

    if (!me.response.ok) {
      return NextResponse.json(me.data, {
        status: me.response.status,
      });
    }

    if (!isAdminUser(me.data)) {
      return NextResponse.json(
        { message: "Administrator access required." },
        { status: 403 }
      );
    }

    const ids = new Set<number>();

    for (let page = 1; page <= 100; page++) {
      const q = new URLSearchParams({
        page: String(page),
        per_page: "100",
      });

      const result = await growfundJson(
        `${apiBase}/fundraisers/paginated?${q}`,
        { headers: { Authorization: auth.authorization } }
      );

      if (!result.response.ok) {
        return NextResponse.json(result.data, {
          status: result.response.status,
        });
      }

      const data = result.data;
      const batch =
        data?.data?.results ??
        data?.data?.data ??
        data?.data?.items ??
        data?.data ??
        data?.results ??
        [];

      if (!Array.isArray(batch)) {
        throw new Error("Unexpected fundraiser response.");
      }

      for (const person of batch) {
        const id = Number(
          person?.id ?? person?.user_id ?? person?.fundraiser_id
        );
        if (id > 0) ids.add(id);
      }

      if (batch.length < 100) break;
      if (page === 100) {
        throw new Error("Fundraiser pagination limit reached.");
      }
    }

    let total = 0;

    // Small batches avoid overloading WordPress.
    const fundraiserIds = [...ids];
    for (let i = 0; i < fundraiserIds.length; i += 10) {
      const batch = fundraiserIds.slice(i, i + 10);

      const amounts = await Promise.all(
        batch.map(async (id) => {
          const result = await growfundJson(
            `${apiBase}/fundraiser/wallet/info?fundraiser_id=${id}`,
            { headers: { Authorization: auth.authorization } }
          );

          if (!result.response.ok) {
            throw new Error(`Wallet lookup failed for fundraiser ${id}.`);
          }

          const value = Number(
            result.data?.data?.available_withdraw_amount
          );

          if (!Number.isFinite(value) || value < 0) {
            throw new Error(`Invalid wallet balance for fundraiser ${id}.`);
          }

          return value;
        })
      );

      total += amounts.reduce((sum, amount) => sum + amount, 0);
    }

    return NextResponse.json({
      success: true,
      total_payable: Math.round(total * 100) / 100,
      fundraiser_count: ids.size,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error
          ? error.message
          : "Unable to calculate Total Payable.",
      },
      { status: 500 }
    );
  }
}
