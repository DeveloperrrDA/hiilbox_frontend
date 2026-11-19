console.log("📂 ROUTE.TS MODULE LOADED SUCCESSFULLY");
import { getCloudflareContext } from "@opennextjs/cloudflare";
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
      // Fetch the native Cloudflare environment context
      const { env } = await getCloudflareContext();
      
      // Bypass TypeScript's strict type checking for the custom binding
      const db = (env as any).growfund_db;
      
      if (db) {
        console.log("⚡ D1 BINDING FOUND! Querying Edge Database...");
        const { results } = await db.prepare("SELECT * FROM campaigns ORDER BY id DESC").all();
        return NextResponse.json({ success: true, data: results }, { status: 200 });
      } else {
        console.log("⚠️ D1 Binding not found in Cloudflare Context. Falling back to WordPress...");
      }
    } catch (error) {
      console.error("🔥 D1 INTERCEPT CRASHED:", error);
    }
  }
  // ==========================================

  // ==========================================
  // ⚡ D1 DATABASE INTERCEPT: ADMIN DONATIONS
  // ==========================================
  if (method === "GET" && backendPath === "donations/paginated") {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const db = (env as any).growfund_db;

      if (db) {
        const sp = req.nextUrl.searchParams;
        const page = Math.max(1, Number(sp.get("page") || 1));
        const perPage = Math.min(100, Math.max(1, Number(sp.get("per_page") || 10)));
        const offset = (page - 1) * perPage;

        const status = sp.get("status")?.trim().toLowerCase();
        const campaignId = sp.get("campaign_id")?.trim();
        const search = sp.get("search")?.trim();
        const startDate = sp.get("start_date")?.trim();
        const endDate = sp.get("end_date")?.trim();

        const conditions: string[] = [];
        const bindings: any[] = [];

        if (status && status !== "all") {
          if (status === "trash" || status === "trashed") {
            conditions.push(`LOWER(COALESCE(d.status, '')) IN ('trash', 'trashed')`);
          } else if (status === "completed") {
            conditions.push(`LOWER(COALESCE(d.status, '')) NOT IN ('trash', 'trashed') AND LOWER(COALESCE(d.payment_status, d.status, '')) IN ('completed', 'paid', 'approved')`);
          } else {
            conditions.push(`LOWER(COALESCE(d.status, '')) NOT IN ('trash', 'trashed') AND LOWER(COALESCE(d.payment_status, d.status, '')) = ?`);
            bindings.push(status);
          }
        } else {
          conditions.push(`LOWER(COALESCE(d.status, '')) NOT IN ('trash', 'trashed')`);
        }

        if (campaignId && Number(campaignId) > 0) {
          conditions.push(`d.campaign_id = ?`);
          bindings.push(Number(campaignId));
        }

        if (search) {
          const like = `%${search}%`;
          conditions.push(`(
            CAST(d.id AS TEXT) LIKE ? OR
            COALESCE(d.uid, '') LIKE ? OR
            COALESCE(d.donor, '') LIKE ? OR
            COALESCE(d.campaign, '') LIKE ? OR
            COALESCE(c.title, '') LIKE ?
          )`);
          bindings.push(like, like, like, like, like);
        }

        if (startDate) {
          conditions.push(`d.created_at >= ?`);
          bindings.push(`${startDate} 00:00:00`);
        }

        if (endDate) {
          conditions.push(`d.created_at <= ?`);
          bindings.push(`${endDate} 23:59:59`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        // 1. Total matching records
        const countRow = await db
          .prepare(`SELECT COUNT(*) as total FROM donations d LEFT JOIN campaigns c ON d.campaign_id = c.id ${whereClause}`)
          .bind(...bindings)
          .first();

        const total = Number(countRow?.total || 0);

        // 2. Paginated rows joined with campaigns fallback
        const { results } = await db
          .prepare(`
            SELECT 
              d.*,
              c.title AS joined_campaign_title,
              c.images AS joined_campaign_images
            FROM donations d
            LEFT JOIN campaigns c ON d.campaign_id = c.id
            ${whereClause}
            ORDER BY d.id DESC
            LIMIT ? OFFSET ?
          `)
          .bind(...bindings, perPage, offset)
          .all();

        const safeParse = (val: any) => {
          if (!val || typeof val !== "string") return val ?? null;
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        };

        const hydratedRows = (results || []).map((row: any) => {
          const parsedCampaign = safeParse(row.campaign);
          const joinedImages = safeParse(row.joined_campaign_images);

          const campaignObj =
            parsedCampaign && typeof parsedCampaign === "object"
              ? parsedCampaign
              : row.campaign_id
                ? {
                    id: row.campaign_id,
                    title: row.joined_campaign_title || `Campaign #${row.campaign_id}`,
                    images: Array.isArray(joinedImages) ? joinedImages : [],
                  }
                : null;

          return {
            ...row,
            campaign: campaignObj,
            donor: safeParse(row.donor),
            fund: safeParse(row.fund),
            payment_method: safeParse(row.payment_method),
          };
        });

        return NextResponse.json(
          {
            success: true,
            data: hydratedRows,
            pagination: {
              page,
              per_page: perPage,
              total,
              total_pages: Math.max(1, Math.ceil(total / perPage)),
            },
          },
          {
            status: 200,
            headers: { "X-Hiilbox-Source": "D1-Edge" },
          }
        );
      }
    } catch (error) {
      console.error("🔥 D1 DONATIONS INTERCEPT FAILED, FALLING BACK TO WP:", error);
    }
  }

  // ==========================================
  // ⚡ D1 DATABASE INTERCEPT: ADMIN WITHDRAWALS
  // ==========================================
  if (method === "GET" && backendPath === "fundraiser/withdrawal/requests/paginated") {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const db = (env as any).growfund_db;

      if (db) {
        const sp = req.nextUrl.searchParams;
        const page = Math.max(1, Number(sp.get("page") || 1));
        const perPage = Math.min(200, Math.max(1, Number(sp.get("per_page") || 100)));
        const offset = (page - 1) * perPage;

        const countRow = await db
          .prepare(`SELECT COUNT(*) as total FROM withdrawal_requests`)
          .first();

        const total = Number(countRow?.total || 0);

        const { results } = await db
          .prepare(`
            SELECT 
              w.*,
              f.first_name AS joined_first_name,
              f.last_name AS joined_last_name,
              f.email AS joined_email,
              f.username AS joined_username
            FROM withdrawal_requests w
            LEFT JOIN fundraisers f ON w.fundraiser_id = f.id
            ORDER BY w.id DESC
            LIMIT ? OFFSET ?
          `)
          .bind(perPage, offset)
          .all();

        const safeParse = (val: any) => {
          if (!val || typeof val !== "string") return val ?? null;
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        };

        const hydratedRows = (results || []).map((row: any) => {
          const parsedFundraiser = safeParse(row.fundraiser);
          const fundraiserObj =
            parsedFundraiser && typeof parsedFundraiser === "object"
              ? parsedFundraiser
              : row.fundraiser_id
                ? {
                    id: row.fundraiser_id,
                    first_name: row.joined_first_name || "",
                    last_name: row.joined_last_name || "",
                    email: row.joined_email || "",
                    username: row.joined_username || "",
                  }
                : null;

          return {
            ...row,
            withdrawal_request_id: row.id,
            fundraiser: fundraiserObj,
          };
        });

        console.log("📂 SUCCESS - D1 WITHDRAWALS INTERCEPT", { count: hydratedRows.length, total });

        return NextResponse.json(
          {
            success: true,
            data: hydratedRows,
            pagination: {
              page,
              per_page: perPage,
              total,
              total_pages: Math.max(1, Math.ceil(total / perPage)),
            },
          },
          {
            status: 200,
            headers: { "X-Hiilbox-Source": "D1-Edge" },
          }
        );
      }
    } catch (error) {
      console.error("🔥 D1 WITHDRAWALS INTERCEPT FAILED, FALLING BACK TO WP:", error);
    }
  }

  // ==========================================
  // ⚡ D1 DATABASE INTERCEPT: ADMIN DONORS
  // ==========================================
  if (method === "GET" && backendPath === "donors/paginated") {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const db = (env as any).growfund_db;

      if (db) {
        const sp = req.nextUrl.searchParams;
        const page = Math.max(1, Number(sp.get("page") || 1));
        const perPage = Math.min(200, Math.max(1, Number(sp.get("per_page") || 100)));
        const offset = (page - 1) * perPage;

        const status = sp.get("status")?.trim().toLowerCase();
        const search = sp.get("search")?.trim();

        const conditions: string[] = [];
        const bindings: any[] = [];

        if (status && status !== "all") {
          if (status === "trash" || status === "trashed") {
            conditions.push(`LOWER(COALESCE(status, 'active')) IN ('trash', 'trashed')`);
          } else {
            conditions.push(`LOWER(COALESCE(status, 'active')) = ?`);
            bindings.push(status);
          }
        }

        if (search) {
          const like = `%${search}%`;
          conditions.push(`(
            CAST(id AS TEXT) LIKE ? OR
            COALESCE(first_name, '') LIKE ? OR
            COALESCE(last_name, '') LIKE ? OR
            COALESCE(email, '') LIKE ? OR
            COALESCE(username, '') LIKE ? OR
            COALESCE(phone, '') LIKE ?
          )`);
          bindings.push(like, like, like, like, like, like);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const countRow = await db
          .prepare(`SELECT COUNT(*) as total FROM donors ${whereClause}`)
          .bind(...bindings)
          .first();

        const total = Number(countRow?.total || 0);

        const { results } = await db
          .prepare(`
            SELECT * FROM donors
            ${whereClause}
            ORDER BY id DESC
            LIMIT ? OFFSET ?
          `)
          .bind(...bindings, perPage, offset)
          .all();

        const safeParse = (val: any) => {
          if (!val || typeof val !== "string") return val ?? null;
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        };

        const hydratedRows = (results || []).map((row: any) => ({
          ...row,
          image: safeParse(row.image),
          billing_address: safeParse(row.billing_address),
        }));

        return NextResponse.json(
          {
            success: true,
            data: hydratedRows,
            pagination: {
              page,
              per_page: perPage,
              total,
              total_pages: Math.max(1, Math.ceil(total / perPage)),
            },
          },
          {
            status: 200,
            headers: { "X-Hiilbox-Source": "D1-Edge" },
          }
        );
      }
    } catch (error) {
      console.error("🔥 D1 DONORS INTERCEPT FAILED, FALLING BACK TO WP:", error);
    }
  }

  // ==========================================
  // ⚡ D1 DATABASE INTERCEPT: ADMIN FUNDRAISERS
  // ==========================================
  if (method === "GET" && backendPath === "fundraisers/paginated") {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const db = (env as any).growfund_db;

      if (db) {
        const sp = req.nextUrl.searchParams;
        const page = Math.max(1, Number(sp.get("page") || 1));
        const perPage = Math.min(200, Math.max(1, Number(sp.get("per_page") || 100)));
        const offset = (page - 1) * perPage;

        const status = sp.get("status")?.trim().toLowerCase();
        const search = sp.get("search")?.trim();

        const conditions: string[] = [];
        const bindings: any[] = [];

        if (status && status !== "all") {
          const statusGroups: Record<string, string[]> = {
            pending: ["pending", "review", "submitted", "inactive"],
            approved: ["approved", "active"],
            declined: ["inactive", "declined", "rejected", "denied"],
            trash: ["trash", "trashed"],
          };

          const allowed = statusGroups[status] ?? [status];
          const placeholders = allowed.map(() => "?").join(",");
          conditions.push(`LOWER(COALESCE(status, 'pending')) IN (${placeholders})`);
          bindings.push(...allowed);
        }

        if (search) {
          const like = `%${search}%`;
          conditions.push(`(
            CAST(id AS TEXT) LIKE ? OR
            COALESCE(first_name, '') LIKE ? OR
            COALESCE(last_name, '') LIKE ? OR
            COALESCE(email, '') LIKE ? OR
            COALESCE(username, '') LIKE ? OR
            COALESCE(phone, '') LIKE ?
          )`);
          bindings.push(like, like, like, like, like, like);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const countRow = await db
          .prepare(`SELECT COUNT(*) as total FROM fundraisers ${whereClause}`)
          .bind(...bindings)
          .first();

        const total = Number(countRow?.total || 0);

        const { results } = await db
          .prepare(`
            SELECT * FROM fundraisers
            ${whereClause}
            ORDER BY id DESC
            LIMIT ? OFFSET ?
          `)
          .bind(...bindings, perPage, offset)
          .all();

        const safeParse = (val: any) => {
          if (!val || typeof val !== "string") return val ?? null;
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        };

        const hydratedRows = (results || []).map((row: any) => ({
          ...row,
          image: safeParse(row.image),
          decline_reason: safeParse(row.decline_reason),
        }));

        console.log("📂 SUCCESS - D1 FUNDRAISERS INTERCEPT", { count: hydratedRows.length, total });

        return NextResponse.json(
          {
            success: true,
            data: hydratedRows,
            pagination: {
              page,
              per_page: perPage,
              total,
              total_pages: Math.max(1, Math.ceil(total / perPage)),
            },
          },
          {
            status: 200,
            headers: { "X-Hiilbox-Source": "D1-Edge" },
          }
        );
      }
    } catch (error) {
      console.error("🔥 D1 FUNDRAISERS INTERCEPT FAILED, FALLING BACK TO WP:", error);
    }
  }

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