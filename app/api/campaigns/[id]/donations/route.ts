
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DonationRow = {
  id: number;
  uid: string | null;
  donor: string | null;
  amount: number | null;
  is_anonymous: number | null;
  created_at: string | null;
  status: string | null;
  payment_status: string | null;
};

function getDonorName(value: string | null): string {
  if (!value) return "Supporter";

  let donor: unknown = value;

  try {
    donor = JSON.parse(value);
  } catch {
    return value.trim() || "Supporter";
  }

  if (typeof donor === "string") {
    return donor.trim() || "Supporter";
  }

  if (!donor || typeof donor !== "object") {
    return "Supporter";
  }

  const d = donor as Record<string, unknown>;

  const fullName = [
    d.first_name,
    d.last_name
  ]
    .filter((part) => typeof part === "string" && part.trim())
    .join(" ");

  const name =
  fullName ||
  d.display_name ||
  d.donor_name ||
  d.name;

  return typeof name === "string" && name.trim()
    ? name.trim()
    : "Supporter";
}

function normalizeDonation(row: DonationRow) {
  const anonymous = Number(row.is_anonymous) === 1;

  return {
    id: String(row.uid || row.id),
    donor_name: anonymous
      ? "Anonymous"
      : getDonorName(row.donor),
    amount: Number(row.amount || 0),
    currency: "USD",
    created_at: row.created_at,
    is_anonymous: anonymous,
    status: "completed",
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignId = Number(id);

    if (
      !Number.isSafeInteger(campaignId) ||
      campaignId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          completed_count: 0,
          message: "Invalid campaign ID",
        },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext({
      async: true,
    });

    const db = (env as any).growfund_db;

    if (!db) {
      throw new Error("D1 binding growfund_db not found");
    }

    const countResult = await db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM donations
        WHERE campaign_id = ?
          AND LOWER(TRIM(status)) = 'completed'
          AND LOWER(TRIM(payment_status)) = 'paid'
      `)
      .bind(campaignId)
      .first();

    const result = await db
      .prepare(`
        SELECT
          id,
          uid,
          donor,
          amount,
          is_anonymous,
          created_at,
          status,
          payment_status
        FROM donations
        WHERE campaign_id = ?
          AND LOWER(TRIM(status)) = 'completed'
          AND LOWER(TRIM(payment_status)) = 'paid'
        ORDER BY created_at DESC, id DESC
        LIMIT 100
      `)
      .bind(campaignId)
      .all();

   const donations = (result.results || []).map(
  (row: any) => normalizeDonation(row as DonationRow)
);

    return NextResponse.json(
      {
        success: true,
        data: donations,
        completed_count: Number(
          countResult?.total || 0
        ),
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Hiilbox-Source": "Cloudflare-D1",
        },
      }
    );
  } catch (error) {
    console.error(
      "Recent Donations D1 error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        data: [],
        completed_count: 0,
        message: "Unable to load recent donations",
      },
      { status: 500 }
    );
  }
}
