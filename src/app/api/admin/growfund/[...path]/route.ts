
import { NextRequest, NextResponse } from "next/server";
import {
  apiBase,
  growfundJson,
  requireUser,
} from "@/app/api/dashboard/campaigns/_server";

import { isAdminUser } from "@/app/api/dashboard/_owned";
import { readAdminD1 } from "@/lib/server/admin-d1";

const ALLOWED = [
  /^campaigns(?:\/|$)/,
  /^campaign(?:\/|$)/,
  /^donations(?:\/|$)/,
  /^donation(?:\/|$)/,
  /^donors(?:\/|$)/,
  /^donor(?:\/|$)/,
  /^fundraisers(?:\/|$)/,
  /^fundraiser(?:\/|$)/,
  /^users(?:\/|$)/,
  /^analytics(?:\/|$)/, // Restored from your live version
  /^media(?:\/|$)/,
];

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: "GET" | "POST" | "DELETE",
) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  const { path } = await context.params;
  const backendPath = (path || []).join("/");

  if (
    !backendPath ||
    !ALLOWED.some((pattern) => pattern.test(backendPath))
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Unsupported admin endpoint.",
      },
      { status: 404 }
    );
  }

  // ==========================================
  // NEW: OPTIONAL ADMIN D1 DATABASE READS
  // ==========================================
  // Existing WordPress functionality is
  // preserved.
  //
  // These connections are disabled by default.
  // Only GET listing requests are intercepted.
  // POST and DELETE continue to WordPress.
  // ==========================================

  const d1Routes: Record<
    string,
    "donors" | "fundraisers" | "withdrawals"
  > = {
    "donors/paginated": "donors",
    "fundraisers/paginated": "fundraisers",
    "fundraiser/withdrawal/requests/paginated": "withdrawals",
  };

  const d1Listing = d1Routes[backendPath];

  const d1Flags = {
    donors: "ADMIN_DONORS_D1_ENABLED",
    fundraisers: "ADMIN_FUNDRAISERS_D1_ENABLED",
    withdrawals: "ADMIN_WITHDRAWALS_D1_ENABLED",
  };

  const d1Enabled =
    method === "GET" &&
    d1Listing !== undefined &&
    process.env[d1Flags[d1Listing]] === "true";

  if (d1Enabled && d1Listing) {
    try {
      const startedAt = Date.now();
      // Preserve administrator authorization.
      const me = await growfundJson(
        `${apiBase}/auth/me`,
        {
          headers: {
            Authorization: auth.authorization,
          },
        }
      );
      const authDuration = Date.now() - startedAt;

console.info("[Admin D1] Authentication completed", {
  listing: d1Listing,
  durationMs: authDuration,
});

      if (!me.response.ok) {
        return NextResponse.json(me.data, {
          status: me.response.status,
        });
      }

      if (!isAdminUser(me.data)) {
        return NextResponse.json(
          {
            success: false,
            message: "Administrator access required.",
          },
          { status: 403 }
        );
      }

      // Read the requested listing from D1.
     const d1StartedAt = Date.now();

const result = await readAdminD1(
  d1Listing,
  req.nextUrl.searchParams
);

const d1Duration = Date.now() - d1StartedAt;

console.info("[Admin D1] Query completed", {
  listing: d1Listing,
  authMs: authDuration,
  d1Ms: d1Duration,
  totalMs: Date.now() - startedAt,
});

return NextResponse.json(result, {
  status: 200,
  headers: {
    "Cache-Control": "private, no-store",
    "X-Data-Source": "cloudflare-d1",
    "Server-Timing":
      `wp-auth;dur=${authDuration}, d1;dur=${d1Duration}`,
  },
});
    } catch (error) {
      console.error(
        "[Admin D1] Falling back to WordPress:",
        error
      );

      // If D1 fails, continue through the
      // original WordPress proxy below.
    }
  }

  // ==========================================
  // END NEW ADMIN D1 CONNECTIONS
  // ==========================================


  // ==========================================
  // ⚡ D1 DATABASE INTERCEPT (EDGE SPEED)
  // ORIGINAL WORKING CODE - PRESERVED
  // ==========================================
  if (method === "GET" && backendPath === "campaigns") {
    try {
      // OpenNext injects Cloudflare bindings into process.env
      const db = process.env.growfund_db as any;

      if (db) {
        console.log(
          "⚡ D1 BINDING FOUND! Querying Edge Database..."
        );

        // Query the D1 database
        const { results } = await db
          .prepare(
            "SELECT * FROM campaigns ORDER BY id DESC"
          )
          .all();

        // Return instantly, bypassing WordPress entirely
        return NextResponse.json(
          {
            success: true,
            data: results,
          },
          { status: 200 }
        );
      } else {
        console.log(
          "⚠️ D1 Binding not found. Falling back to WordPress..."
        );
      }
    } catch (error) {
      console.error(
        "🔥 D1 INTERCEPT CRASHED:",
        error
      );

      // If the table doesn't exist yet or
      // the query fails, let it fall through
      // to the WordPress proxy below.
    }
  }
  // ==========================================


  // ==========================================
  // ORIGINAL WORDPRESS PROXY - PRESERVED
  // ==========================================

  const target = new URL(
    `${apiBase}/${backendPath}`
  );

  req.nextUrl.searchParams.forEach(
    (value, key) =>
      target.searchParams.append(key, value)
  );

  // Restored your secure API key fallback
  const apiKey =
    process.env.GROWFUND_CLIENT_API_KEY ||
    process.env.NEXT_PUBLIC_GROWFUND_CLIENT_API_KEY ||
    "";

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: auth.authorization,
  };

  // Restored your specific System Token logic
  const needsSystemToken =
    method === "GET" &&
    /^(campaigns|users)(?:\/|$)/.test(backendPath);

  if (needsSystemToken) {
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "GrowFund API key is not configured on the frontend server. Set GROWFUND_CLIENT_API_KEY in the deployment environment.",
        },
        { status: 500 }
      );
    }

    try {
      const tokenResponse = await fetch(
        `${apiBase}/auth/system-token`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        }
      );

      const tokenRaw =
        await tokenResponse.text();

      let tokenData: any = null;

      try {
        tokenData = tokenRaw
          ? JSON.parse(tokenRaw)
          : null;
      } catch {
        tokenData = null;
      }

      const systemToken =
        tokenData?.system_access_token;

      if (
        !tokenResponse.ok ||
        !systemToken
      ) {
        return NextResponse.json(
          tokenData || {
            success: false,
            message:
              "Unable to obtain GrowFund system token.",
          },
          {
            status: tokenResponse.ok
              ? 502
              : tokenResponse.status,
          }
        );
      }

      headers.Authorization =
        `Bearer ${systemToken}`;

      headers["X-API-Key"] = apiKey;
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Unable to obtain GrowFund system token.",
        },
        { status: 502 }
      );
    }
  } else if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  // ==========================================
  // ORIGINAL POST / DELETE BODY HANDLING
  // ==========================================

  let body: string | undefined;

  if (method !== "GET") {
    body = await req.text();

    if (body) {
      headers["Content-Type"] =
        req.headers.get("content-type") ||
        "application/json";
    }
  }

  // ==========================================
  // ORIGINAL GROWFUND API REQUEST
  // ==========================================

  try {
    const {
      response,
      data,
    }: {
      response: any;
      data: any;
    } = await growfundJson(
      target.toString(),
      {
        method,
        headers,
        body: body || undefined,
      }
    );

    if (
      !response.ok &&
      /api key/i.test(
        String(
          data?.message ||
          data?.data?.message ||
          ""
        )
      ) &&
      !apiKey
    ) {
      return NextResponse.json(
        {
          ...data,
          message:
            "GrowFund API key is not configured on the frontend server. Set GROWFUND_CLIENT_API_KEY in the deployment environment.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      data,
      { status: response.status }
    );
  } catch (error) {
    console.error(
      "🔥 PROXY CRASHED:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Admin request failed.",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// ORIGINAL HTTP HANDLERS - PRESERVED
// ==========================================

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ path: string[] }>;
  }
) {
  return proxy(req, context, "GET");
}

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{ path: string[] }>;
  }
) {
  return proxy(req, context, "POST");
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ path: string[] }>;
  }
) {
  return proxy(req, context, "DELETE");
}
