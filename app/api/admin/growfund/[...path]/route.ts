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
  /^analytics(?:\/|$)/,
  /^media(?:\/|$)/,
];

// Force route to edge for D1 access
export const runtime = "edge";

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

  // =========================================================================
  // D1 DATABASE INTERCEPT: Serve GET /campaigns instantly from Cloudflare D1
  // =========================================================================
  if (method === "GET" && backendPath === "campaigns") {
    const db = process.env.growfund_db as any; 
    console.log("IS LOCAL D1 BINDING ACTIVE?:", !!db); 
    
    if (db) {
      try {
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status") || "all";
        const search = searchParams.get("search") || "";
        const limit = Number(searchParams.get("per_page")) || 100;
        const page = Number(searchParams.get("page")) || 1;
        const offset = (page - 1) * limit;

        let sql = "SELECT * FROM campaigns";
        let countSql = "SELECT COUNT(*) as total FROM campaigns";
        const params: any[] = [];
        const conditions: string[] = [];

        if (status !== "all") {
          if (status === "trash") {
            conditions.push("status IN ('trash', 'trashed')");
          } else {
            conditions.push("status = ?");
            params.push(status);
          }
        }

        if (search) {
          conditions.push("(title LIKE ? OR id = ?)");
          params.push(`%${search}%`, Number(search) || 0);
        }

        if (conditions.length > 0) {
          const whereClause = " WHERE " + conditions.join(" AND ");
          sql += whereClause;
          countSql += whereClause;
        }

        sql += " ORDER BY id DESC LIMIT ? OFFSET ?";

        const [totalResult, results] = await Promise.all([
          db.prepare(countSql).bind(...params).first(),
          db.prepare(sql).bind(...params, limit, offset).all()
        ]);

        const parsedData = results.results.map((row: any) => ({
          ...row,
          images: JSON.parse(row.images || "[]"),
          video: JSON.parse(row.video || "{}"),
          author: JSON.parse(row.author || "{}"),
          fundraiser: JSON.parse(row.fundraiser || "{}"),
          tags: JSON.parse(row.tags || "[]"),
          collaborators: JSON.parse(row.collaborators || "[]"),
          suggested_options: JSON.parse(row.suggested_options || "[]"),
          faqs: JSON.parse(row.faqs || "[]"),
          rewards: JSON.parse(row.rewards || "[]"),
          tribute_options: JSON.parse(row.tribute_options || "[]"),
          default_fund: JSON.parse(row.default_fund || "{}"),
          fund_choices: JSON.parse(row.fund_choices || "[]"),
          extra_data: JSON.parse(row.extra_data || "{}")
        }));

        return NextResponse.json({
          success: true,
          data: parsedData,
          paginated: {
            total: totalResult?.total || 0,
            count: parsedData.length,
            current_page: page,
            per_page: limit,
            has_more: (offset + parsedData.length) < (totalResult?.total || 0),
            results: parsedData
          }
        });
      } catch (err) {
        console.error("D1 Fetch failed, falling back to WP:", err);
        // If D1 fails for any reason, code naturally falls through to hit WP below!
      }
    }
  }
  // =========================================================================

  const target = new URL(`${apiBase}/${backendPath}`);
  req.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  const apiKey = process.env.GROWFUND_CLIENT_API_KEY || process.env.NEXT_PUBLIC_GROWFUND_CLIENT_API_KEY || "";
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: auth.authorization,
  };

  const needsSystemToken = method === "GET" && /^(campaigns|users)(?:\/|$)/.test(backendPath);
  
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
        headers: { Accept: "application/json", "Content-Type": "application/json", "X-API-Key": apiKey },
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
    const { response, data } = await growfundJson(target.toString(), {
      method,
      headers,
      body: body || undefined,
    });

    // CAST `data` to `any` to fix TypeScript "Property message does not exist on type {}"
    const responseData: any = data;

    if (!response.ok && /api key/i.test(String(responseData?.message || responseData?.data?.message || "")) && !apiKey) {
      return NextResponse.json(
        {
          ...responseData,
          message: "GrowFund API key is not configured on the frontend server. Set GROWFUND_CLIENT_API_KEY in the deployment environment.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(responseData, { status: response.status });
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