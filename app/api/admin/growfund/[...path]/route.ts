console.log("📂 ROUTE.TS MODULE LOADED SUCCESSFULLY");
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
  if (!backendPath || !ALLOWED.some((pattern) => pattern.test(backendPath))) {
    return NextResponse.json({ success: false, message: "Unsupported admin endpoint." }, { status: 404 });
  }

 // ==========================================
  // ⚡ D1 DATABASE INTERCEPT (EDGE SPEED)
  // ==========================================
  if (method === "GET" && backendPath === "campaigns") {
    try {
      const bindingName = "growfund_db";
      
      // Hunt for the binding in all possible OpenNext / Cloudflare injection points
      const db = 
        (process.env as any)[bindingName] || 
        (globalThis as any)[bindingName] || 
        (globalThis as any)?.env?.[bindingName] ||
        (req as any)?.env?.[bindingName] || 
        (context as any)?.env?.[bindingName];
      
      if (db) {
        console.log("⚡ D1 BINDING FOUND! Querying Edge Database...");
        const { results } = await db.prepare("SELECT * FROM campaigns ORDER BY id DESC").all();
        return NextResponse.json({ success: true, data: results }, { status: 200 });
      } else {
        console.log("⚠️ D1 Binding not found. Falling back to WordPress...");
        // DIAGNOSTIC: Log available keys to see where Cloudflare is putting it
        const envKeys = Object.keys(process.env || {}).filter(k => !k.startsWith("npm_") && !k.startsWith("NEXT"));
        console.log("🔍 Available env keys:", envKeys.join(", "));
      }
    } catch (error) {
      console.error("🔥 D1 INTERCEPT CRASHED:", error);
    }
  }
  // ==========================================

  const target = new URL(`${apiBase}/${backendPath}`);
  req.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  // Restored your secure API key fallback
  const apiKey = process.env.GROWFUND_CLIENT_API_KEY || process.env.NEXT_PUBLIC_GROWFUND_CLIENT_API_KEY || "";
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
    headers["X-API-Key"] = apiKey;
  }

  let body: string | undefined;
  if (method !== "GET") {
    body = await req.text();
    if (body) headers["Content-Type"] = req.headers.get("content-type") || "application/json";
  }

  try {
    const { response, data } : { response: any; data: any } = await growfundJson(target.toString(), {
      method,
      headers,
      body: body || undefined,
    });

    if (!response.ok && /api key/i.test(String(data?.message || data?.data?.message || "")) && !apiKey) {
      return NextResponse.json(
        {
          ...data,
          message: "GrowFund API key is not configured on the frontend server. Set GROWFUND_CLIENT_API_KEY in the deployment environment.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("🔥 PROXY CRASHED:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Admin request failed." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  console.log("🚀 GET ROUTE HIT! Path:", req.nextUrl.pathname);
  try {
    return await proxy(req, context, "GET");
  } catch (error) {
    console.error("💥 FATAL GET ERROR:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  console.log("🚀 POST ROUTE HIT! Path:", req.nextUrl.pathname);
  try {
    return await proxy(req, context, "POST");
  } catch (error) {
    console.error("💥 FATAL POST ERROR:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  console.log("🚀 DELETE ROUTE HIT! Path:", req.nextUrl.pathname);
  try {
    return await proxy(req, context, "DELETE");
  } catch (error) {
    console.error("💥 FATAL DELETE ERROR:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}