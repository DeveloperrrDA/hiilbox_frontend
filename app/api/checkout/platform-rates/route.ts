import { NextResponse } from "next/server";

import {
  gfcmHeaders,
  gfcmUrl,
  systemToken,
} from "../_server";

export async function GET() {
  try {
    const token = await systemToken();

    const response = await fetch(
      gfcmUrl("/platform-rates"),
      {
        headers: gfcmHeaders(token),
        cache: "no-store",
      }
    );

    const data = await response
      .json()
      .catch(() => null);

    return NextResponse.json(
      data ?? {},
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load platform rates.",
      },
      { status: 500 }
    );
  }
}