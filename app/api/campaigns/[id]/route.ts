import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API = (
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1"
).replace(/\/$/, "");

const GROWFUND_API_KEY = process.env.GROWFUND_CLIENT_API_KEY;
// Cache public campaign details for 10 minutes
const campaignDetailsCache = new Map<
  number,
  { data: unknown; expiresAt: number }
>();

const DETAILS_CACHE_TTL = 10 * 60 * 1000;
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignId = Number(id);

    if (!Number.isInteger(campaignId) || campaignId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid campaign ID." },
        { status: 400 }
      );
    }
// Check whether this campaign is already cached
const cachedCampaign = campaignDetailsCache.get(campaignId);

if (cachedCampaign && Date.now() < cachedCampaign.expiresAt) {
  return NextResponse.json(cachedCampaign.data, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Hiilbox-Cache": "HIT",
    },
  });
}
    if (!GROWFUND_API_KEY) {
      return NextResponse.json(
        { success: false, message: "GROWFUND_CLIENT_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const tokenResponse = await fetch(`${WORDPRESS_API}/auth/system-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-API-Key": GROWFUND_API_KEY,
      },
      cache: "no-store",
    });

    const tokenData = await tokenResponse.json().catch(() => null);

    if (!tokenResponse.ok || !tokenData?.system_access_token) {
      return NextResponse.json(
        {
          success: false,
          message: tokenData?.message || "Unable to obtain system access token.",
        },
        { status: tokenResponse.ok ? 502 : tokenResponse.status }
      );
    }

    const response = await fetch(`${WORDPRESS_API}/campaigns/${campaignId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tokenData.system_access_token}`,
        "X-API-Key": GROWFUND_API_KEY,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: "Invalid campaign response from WordPress.",
    }));

    // Save successful campaign details in memory
if (response.ok && data?.success !== false) {
  campaignDetailsCache.set(campaignId, {
    data,
    expiresAt: Date.now() + DETAILS_CACHE_TTL,
  });
}

return NextResponse.json(data, {
  status: response.status,
  headers: {
    "Cache-Control": "private, no-store",
    "X-Hiilbox-Cache": "MISS",
  },
});
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load campaign.",
      },
      { status: 500 }
    );
  }
}
