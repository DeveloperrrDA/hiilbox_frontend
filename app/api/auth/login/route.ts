import { NextRequest, NextResponse } from "next/server";

const LOGIN_URL =
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1/auth/login";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "The WordPress backend returned an invalid response.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("LOGIN PROXY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to the WordPress backend.",
      },
      { status: 502 }
    );
  }
}