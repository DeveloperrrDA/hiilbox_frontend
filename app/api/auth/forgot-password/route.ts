
import { NextRequest, NextResponse } from "next/server";
import { gfcmHeaders, gfcmUrl, systemToken } from "../../checkout/_server";

export async function POST(request: NextRequest) {
  try {
    
const body: { email?: unknown } = await request.json();
const email = body?.email;


    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { message: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const token = await systemToken();

    const response = await fetch(
      gfcmUrl("/auth/password-reset-mail"),
      {
        method: "POST",
        headers: gfcmHeaders(token),
        body: JSON.stringify({ email: email.trim() }),
        cache: "no-store",
      }
    );

    if (!response.ok && response.status !== 404) {
      return NextResponse.json(
        { message: "Unable to send reset email." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists, a password reset email will be sent.",
    });
  } catch {
    return NextResponse.json(
      { message: "Password reset is temporarily unavailable." },
      { status: 502 }
    );
  }
}
