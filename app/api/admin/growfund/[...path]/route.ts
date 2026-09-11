import { NextRequest, NextResponse } from "next/server";
import { apiBase, growfundJson, requireUser } from "@/app/api/dashboard/campaigns/_server";

const ALLOWED = [
  /^campaigns(?:\/|$)/,
  /^campaign(?:\/|$)/,
  /^donations(?:\/|$)/,
  /^donation(?:\/|$)/,
  /^donors(?:\/|$)/,
  /^donor(?:\/|$)/,
  /^fundraisers(?:\/|$)/,
  /^fundraiser(?:\/|$)/,
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
  if (!backendPath || !ALLOWED.some((pattern) => pattern.test(backendPath))) {
    return NextResponse.json({ success: false, message: "Unsupported admin endpoint." }, { status: 404 });
  }

  const target = new URL(`${apiBase}/${backendPath}`);
  req.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  const apiKey = process.env.GROWFUND_CLIENT_API_KEY || process.env.NEXT_PUBLIC_GROWFUND_CLIENT_API_KEY || "";
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: auth.authorization,
  };

  // Campaign GET routes use GFCM_Combined_Auth_Middleware. That middleware
  // expects the GrowFund *system* bearer token + X-API-Key, not the user's JWT.
  // We still call requireUser() above so this proxy remains admin/authenticated-only.
  const needsSystemToken = method === "GET" && /^campaigns(?:\/|$)/.test(backendPath);
  if (needsSystemToken) {
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "GrowFund API key is not configured on the frontend server. Set GROWFUND_CLIENT_API_KEY in the deployment environment." },
        { status: 500 },
      );
    }
    try {
      const tokenResponse = await fetch(`${apiBase}/auth/system-token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        cache: "no-store",
      });
      const tokenRaw = await tokenResponse.text();
      let tokenData: any = null;
      try { tokenData = tokenRaw ? JSON.parse(tokenRaw) : null; } catch { tokenData = null; }
      const systemToken = tokenData?.system_access_token;
      if (!tokenResponse.ok || !systemToken) {
        return NextResponse.json(
          tokenData || { success: false, message: "Unable to obtain GrowFund system token." },
          { status: tokenResponse.ok ? 502 : tokenResponse.status },
        );
      }
      headers.Authorization = `Bearer ${systemToken}`;
      headers["X-API-Key"] = apiKey;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error instanceof Error ? error.message : "Unable to obtain GrowFund system token." },
        { status: 502 },
      );
    }
  } else if (apiKey) {
    // Harmless for JWT-only endpoints and required by any other combined route.
    headers["X-API-Key"] = apiKey;
  }

  let body: string | undefined;
  if (method !== "GET") {
    body = await req.text();
    if (body) headers["Content-Type"] = req.headers.get("content-type") || "application/json";
  }

  try {
    const { response, data } = await growfundJson(target.toString(), {
      method,
      headers,
      body: body || undefined,
    });

    if (!response.ok && /api key/i.test(String(data?.message || data?.data?.message || "")) && !apiKey) {
      return NextResponse.json(
        {
          ...data,
          message:
            "GrowFund API key is not configured on the frontend server. Set GROWFUND_CLIENT_API_KEY in the deployment environment.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Admin request failed." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context, "GET");
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context, "POST");
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context, "DELETE");
}
