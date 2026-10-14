import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.GROWFUND_CLIENT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "GROWFUND_CLIENT_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1/auth/system-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to connect to the WordPress backend" },
      { status: 502 }
    );
  }
}