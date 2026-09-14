import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";

const GROWFUND_API_KEY = process.env.GROWFUND_CLIENT_API_KEY;

export async function GET(request: NextRequest) {
  try {
    // =========================================================
    // STEP 0: Make sure the API key exists
    // =========================================================

    if (!GROWFUND_API_KEY) {
      console.error(
        "CAMPAIGN UPDATESS ERROR: GROWFUND_CLIENT_API_KEY is missing"
      );

      return NextResponse.json(
        {
          success: false,
          message: "GROWFUND_CLIENT_API_KEY is not configured",
        },
        { status: 500 }
      );
    }

    console.log("API KEY RECEIVED:", true);

    // =========================================================
    // STEP 1: Get system access token
    // =========================================================

    const tokenResponse = await fetch(
      `${WORDPRESS_API}/auth/system-token`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-API-Key": GROWFUND_API_KEY,
        },
        cache: "no-store",
      }
    );

    const tokenRaw = await tokenResponse.text();

    let tokenData: any;

    try {
      tokenData = JSON.parse(tokenRaw);
    } catch {
      console.error(
        "SYSTEM TOKEN RETURNED NON-JSON:",
        tokenRaw.slice(0, 1000)
      );

      return NextResponse.json(
        {
          success: false,
          message: "System token endpoint returned invalid JSON",
        },
        { status: 502 }
      );
    }

    console.log(
      "SYSTEM TOKEN RESPONSE:",
      tokenResponse.status,
      tokenData
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "System token request failed",
          details: tokenData,
        },
        { status: tokenResponse.status }
      );
    }

    // The backend returns system_access_token
    const systemToken = tokenData?.system_access_token;

    if (!systemToken) {
      console.error(
        "SYSTEM TOKEN ERROR: system_access_token missing",
        tokenData
      );

      return NextResponse.json(
        {
          success: false,
          message: "System access token was not returned",
          details: tokenData,
        },
        { status: 500 }
      );
    }

    console.log("SYSTEM ACCESS TOKEN RECEIVED:", true);

    // =========================================================
    // STEP 2: Build campaigns URL
    // =========================================================

    const searchParams = request.nextUrl.searchParams;

    const campaignupdatesUrl =
      `${WORDPRESS_API}/campaign/updates/paginated?${searchParams.toString()}`;

    console.log("CAMPAIGN UPDATES URL:", campaignupdatesUrl);

    // =========================================================
    // STEP 3: Call WordPress campaign updates endpoint
    //
    // IMPORTANT:
    // Use X-API-Key, the same header used by the
    // /auth/system-token endpoint.
    // =========================================================

    const response = await fetch(campaignupdatesUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",

        // System authentication
        Authorization: `Bearer ${systemToken}`,

        // GrowFund API key
        "X-API-Key": GROWFUND_API_KEY,
      },
      cache: "no-store",
    });

    // =========================================================
    // STEP 4: Read response safely
    // =========================================================

    const contentType =
      response.headers.get("content-type") || "";

    console.log(
      "CAMPAIGN UPDATES HTTP STATUS:",
      response.status
    );

    console.log(
      "CAMPAIGN UPDATES CONTENT TYPE:",
      contentType
    );

    const rawResponse = await response.text();

    console.log(
      "CAMPAIGN UPDATES RAW RESPONSE:",
      rawResponse
    );

    // =========================================================
    // STEP 5: Parse JSON
    // =========================================================

    let data: any;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "WordPress returned a non-JSON response",
          status: response.status,
          raw_response: rawResponse.slice(0, 1000),
        },
        { status: 502 }
      );
    }

    console.log(
      "CAMPAIGN UPDATES RESPONSE:",
      response.status,
      data
    );

    // =========================================================
    // STEP 6: Return backend response
    // =========================================================

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "CAMPAIGN UPDATE PROXY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch campaigns",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}