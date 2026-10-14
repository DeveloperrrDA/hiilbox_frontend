import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API = (
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1"
).replace(/\/$/, "");

const GROWFUND_API_KEY = process.env.GROWFUND_CLIENT_API_KEY;

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

    return NextResponse.json(data, { status: response.status });
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
