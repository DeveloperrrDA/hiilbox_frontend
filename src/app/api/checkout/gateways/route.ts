import { NextResponse } from "next/server";

function wpBaseUrl() {
  const base =
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    process.env.WP_URL ||
    "";

  return base.replace(/\/+$/, "");
}

export async function GET() {
  try {
    const base = wpBaseUrl();

    if (!base) {
      return NextResponse.json(
        { message: "WordPress URL is not configured.", gateways: [] },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${base}/wp-json/gfcm/v1/checkout-gateways`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const text = await response.text();
    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = {
        message: text || "Unable to load checkout gateways.",
        gateways: [],
      };
    }

    return NextResponse.json(
      data ?? { gateways: [] },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load checkout gateways.",
        gateways: [],
      },
      { status: 500 }
    );
  }
}
