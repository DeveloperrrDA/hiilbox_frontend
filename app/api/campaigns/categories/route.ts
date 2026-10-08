import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";

const GROWFUND_API_KEY = process.env.GROWFUND_CLIENT_API_KEY;

export async function GET(req: NextRequest) {
  const auth = bearer(req);

  if (!auth) {
    return NextResponse.json(
      {
        success: false,
        message: "Please sign in.",
      },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${apiBase}/categories/list`,
    {
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => ({
    success: false,
    message: "Invalid category response from GrowFund.",
  }));

  return NextResponse.json(data, {
    status: response.status,
  });
}