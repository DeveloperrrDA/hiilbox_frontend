import { NextRequest, NextResponse } from "next/server";

export const apiBase = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1").replace(/\/$/, "");
const apiKey = process.env.GROWFUND_CLIENT_API_KEY;

export function bearer(req: NextRequest) {
  const value = req.headers.get("authorization") || "";
  return /^Bearer\s+\S+/i.test(value) ? value : null;
}

export async function growfundJson(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const data = await response.json().catch(() => ({ success: false, message: "Invalid response from GrowFund." }));
  return { response, data };
}

export async function requireUser(req: NextRequest) {
  const authorization = bearer(req);
  if (!authorization) {
    return { error: NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 }) } as const;
  }

  const { response, data } = await growfundJson(`${apiBase}/auth/me`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: authorization },
  });

  if (!response.ok) {
    return { error: NextResponse.json(data, { status: response.status }) } as const;
  }

  const userId = Number(data?.user_id ?? data?.data?.user_id ?? data?.data?.id ?? data?.id ?? 0);
  if (!userId) {
    return { error: NextResponse.json({ success: false, message: "Unable to identify the authenticated user." }, { status: 401 }) } as const;
  }

  return { authorization, userId, user: data } as const;
}

export async function getSystemToken(_origin?: string) {
  if (!apiKey) throw new Error("GROWFUND_CLIENT_API_KEY is not configured.");

  // Call GrowFund directly instead of fetching our own /api/auth/system-token route.
  // Same-origin self-fetches can return a Cloudflare HTML error page in Workers,
  // which then surfaces as "System token endpoint returned invalid JSON".
  const response = await fetch(`${apiBase}/auth/system-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    cache: "no-store",
  });

  const raw = await response.text();
  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error(`GrowFund system-token returned non-JSON (HTTP ${response.status}).`);
  }

  if (!response.ok || !data?.system_access_token) {
    throw new Error(data?.message || data?.data?.message || "Unable to obtain GrowFund system token.");
  }

  return data.system_access_token as string;
}

export function combinedHeaders(systemToken: string) {
  if (!apiKey) throw new Error("GROWFUND_CLIENT_API_KEY is not configured.");
  return { Accept: "application/json", Authorization: `Bearer ${systemToken}`, "X-API-Key": apiKey };
}

export function belongsToUser(campaign: any, userId: number) {
  const ids = [
    campaign?.author?.id,
    campaign?.author_id,
    campaign?.fundraiser?.id,
    campaign?.fundraiser_id,
    campaign?.user_id,
    campaign?.created_by,
    campaign?.owner_id,
  ].map(Number).filter(Boolean);
  return ids.includes(userId);
}

export async function getOwnedCampaign(req: NextRequest, id: string | number, userId: number) {
  const systemToken = await getSystemToken(req.nextUrl.origin);
  const { response, data } = await growfundJson(`${apiBase}/campaigns/${encodeURIComponent(String(id))}`, {
    method: "GET", headers: combinedHeaders(systemToken),
  });
  if (!response.ok) return { response, data, campaign: null };
  const campaign = data?.data ?? data?.campaign ?? (data?.id ? data : null);
  return { response, data, campaign: belongsToUser(campaign, userId) ? campaign : null };
}

export async function proxyUserPost(req: NextRequest, backendPath: string, campaignId?: string | number) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  if (campaignId !== undefined) {
    const owned = await getOwnedCampaign(req, campaignId, auth.userId);
    if (!owned.response.ok) return NextResponse.json(owned.data, { status: owned.response.status });
    if (!owned.campaign) return NextResponse.json({ success: false, message: "You can only manage campaigns raised by your account." }, { status: 403 });
  }
  const body = await req.text();
  const { response, data } = await growfundJson(`${apiBase}${backendPath}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: auth.authorization },
    body: body || undefined,
  });
  return NextResponse.json(data, { status: response.status });
}
