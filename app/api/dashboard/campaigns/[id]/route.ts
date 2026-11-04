import { NextRequest, NextResponse } from "next/server";
import { apiBase, combinedHeaders, getOwnedCampaign, getSystemToken, growfundJson, requireUser } from "../_server";


async function adminRequest(authorization: string) {
  const { response, data } = await growfundJson(`${apiBase}/auth/me`, { method: "GET", headers: { Accept: "application/json", Authorization: authorization } });
  if (!response.ok) return false;
  const source = data?.data ?? data ?? {};
  const raw = source?.roles ?? source?.role ?? source?.user_roles ?? [];
  const roles = (Array.isArray(raw) ? raw : [raw]).map((r: any) => String(r).toLowerCase());
  return roles.some((r: string) => ["administrator", "admin", "shop_manager"].includes(r));
}
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  try {
    const isAdmin = await adminRequest(auth.authorization);
    if (isAdmin) {
      const systemToken = await getSystemToken(req.nextUrl.origin);
      const { response, data } = await growfundJson(`${apiBase}/campaigns/${encodeURIComponent(id)}`, { method: "GET", headers: combinedHeaders(systemToken) });
      return NextResponse.json(data, { status: response.status });
    }
    const owned = await getOwnedCampaign(req, id, auth.userId);
    if (!owned.response.ok) return NextResponse.json(owned.data, { status: owned.response.status });
    if (!owned.campaign) return NextResponse.json({ success: false, message: "Campaign not found for this fundraiser account." }, { status: 404 });
    return NextResponse.json({ success: true, data: owned.campaign });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to load campaign." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  try {
    const isAdmin = await adminRequest(auth.authorization);
    if (!isAdmin) {
      const owned = await getOwnedCampaign(req, id, auth.userId);
      if (!owned.response.ok) return NextResponse.json(owned.data, { status: owned.response.status });
      if (!owned.campaign) return NextResponse.json({ success: false, message: "You can only update campaigns raised by your account." }, { status: 403 });
    }
    const body = await req.text();
    const { response, data } = await growfundJson(`${apiBase}/campaigns/${encodeURIComponent(id)}/update`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: auth.authorization },
      body,
    });
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to update campaign." }, { status: 500 });
  }
}
