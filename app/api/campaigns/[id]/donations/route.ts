import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API = (
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1"
).replace(/\/$/, "");

const GROWFUND_API_KEY = process.env.GROWFUND_CLIENT_API_KEY;
// Cache public completed donations for 30 seconds.
const DONATIONS_CACHE_MS = 30 * 1000;

type DonationsResult = {
  success: true;
  data: ReturnType<typeof normalizeDonation>[];
  completed_count: number;
};

const donationsCache = new Map<
  number,
  { result: DonationsResult; expiresAt: number }
>();

const pendingDonations = new Map<number, Promise<DonationsResult>>();
function pickArray(value: any): any[] {
  const candidates = [
    value?.data?.results,
    value?.data?.items,
    value?.data?.data,
    value?.data,
    value?.paginated?.results,
    value?.results,
    value?.items,
    value,
  ];
  return candidates.find(Array.isArray) ?? [];
}

function normalizeDonation(item: any, index: number) {
  const donor = item?.donor ?? item?.user ?? item?.contributor ?? {};
  const anonymous = Boolean(
    item?.is_anonymous ?? item?.anonymous ?? item?.hide_name ?? item?.donor_anonymous
  );
  const donorName = anonymous
    ? "Anonymous"
    : String(
        item?.donor_name ??
          item?.contributor_name ??
          item?.name ??
          item?.display_name ??
          donor?.display_name ??
          [donor?.first_name, donor?.last_name].filter(Boolean).join(" ") ??
          "Supporter"
      ).trim() || "Supporter";

  const amount = Number(
    item?.amount ??
      item?.donation_amount ??
      item?.total ??
      item?.amount_paid ??
      item?.value ??
      0
  );

  return {
    id: String(item?.id ?? item?.uid ?? item?.donation_id ?? index),
    donor_name: donorName,
    amount: Number.isFinite(amount) ? amount : 0,
    currency: String(item?.currency ?? item?.currency_code ?? item?.display_currency ?? "USD").toUpperCase(),
    created_at: item?.created_at ?? item?.date ?? item?.created ?? item?.donated_at ?? null,
    is_anonymous: anonymous,
    status: String(item?.status ?? item?.payment_status ?? "").toLowerCase(),
  };
}


async function fetchCampaignDonations(
  campaignId: number
): Promise<DonationsResult> {
  if (!GROWFUND_API_KEY) {
    throw new Error("GROWFUND_CLIENT_API_KEY is not configured");
  }

  const tokenResponse = await fetch(
    `${WORDPRESS_API}/auth/system-token`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-API-Key": GROWFUND_API_KEY,
      },
      cache: "no-store",
    }
  );

  const tokenData = await tokenResponse.json().catch(() => null);

  if (!tokenResponse.ok || !tokenData?.system_access_token) {
    throw new Error(
      tokenData?.message || "Unable to obtain system access token."
    );
  }

  const query = new URLSearchParams({
    campaign_id: String(campaignId),
    page: "1",
    per_page: "100",
    orderby: "created_at",
    order: "desc",
  });

  const response = await fetch(
    `${WORDPRESS_API}/campaigns/${campaignId}/donation-feed?${query.toString()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tokenData.system_access_token}`,
        "X-API-Key": GROWFUND_API_KEY,
      },
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Unable to load recent donations.");
  }

  const donations = (
    Array.isArray(data?.data) ? data.data : pickArray(data)
  )
.map(normalizeDonation)
.filter(
  (item: ReturnType<typeof normalizeDonation>) =>
    String(item.status ?? "").trim().toLowerCase() === "completed"
)
.sort((
  a: ReturnType<typeof normalizeDonation>,
  b: ReturnType<typeof normalizeDonation>
) => {
      const aTime = a.created_at ? Date.parse(a.created_at) : 0;
      const bTime = b.created_at ? Date.parse(b.created_at) : 0;
      return bTime - aTime || Number(b.id) - Number(a.id);
    });

  return {
    success: true,
    data: donations,
    completed_count: donations.length,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaignId = Number(id);

  if (!Number.isInteger(campaignId) || campaignId <= 0) {
    return NextResponse.json(
      { success: false, message: "Invalid campaign ID." },
      { status: 400 }
    );
  }

  if (!GROWFUND_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        message: "GROWFUND_CLIENT_API_KEY is not configured",
      },
      { status: 500 }
    );
  }

  const cached = donationsCache.get(campaignId);

  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.result, {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Hiilbox-Cache": "HIT",
      },
    });
  }

  try {
    let pending = pendingDonations.get(campaignId);

    if (!pending) {
      pending = fetchCampaignDonations(campaignId);
      pendingDonations.set(campaignId, pending);

      void pending.finally(() => {
        pendingDonations.delete(campaignId);
      }).catch(() => {});
    }

    const result = await pending;

    donationsCache.set(campaignId, {
      result,
      expiresAt: Date.now() + DONATIONS_CACHE_MS,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Hiilbox-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Campaign donations fetch failed:", error);

    // Reuse previously fetched public data if WordPress is unavailable.
    if (cached) {
      return NextResponse.json(cached.result, {
        headers: {
          "Cache-Control": "private, no-store",
          "X-Hiilbox-Cache": "STALE",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load recent donations.",
      },
      { status: 502 }
    );
  }
}
