
import { NextRequest, NextResponse } from "next/server";
import { gfcmHeaders, gfcmUrl, systemToken } from "../../checkout/_server";

export async function POST(request: NextRequest) {
  try {

const body: {
  login?: unknown;
  key?: unknown;
  password?: unknown;
  password_confirmation?: unknown;
} = await request.json();

const { login, key, password, password_confirmation } = body;


    if (
      typeof login !== "string" ||
      typeof key !== "string" ||
      typeof password !== "string" ||
      typeof password_confirmation !== "string" ||
      !login ||
      !key ||
      login.length > 255 ||
      key.length > 255 ||
      password.length < 8 ||
      password.length > 1024 ||
      password !== password_confirmation
    ) {
      return NextResponse.json(
        { message: "Invalid reset link or password." },
        { status: 400 }
      );
    }

    const token = await systemToken();

    const response = await fetch(
      gfcmUrl("/auth/password-reset"),
      {
        method: "POST",
        headers: gfcmHeaders(token),
        body: JSON.stringify({
          login,
          key,
          password,
          password_confirmation,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            response.status >= 500
              ? "Unable to reset password right now."
              : "Reset link is invalid or expired.",
        },
        { status: response.status >= 500 ? 502 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Password reset is temporarily unavailable." },
      { status: 502 }
    );
  }
}
