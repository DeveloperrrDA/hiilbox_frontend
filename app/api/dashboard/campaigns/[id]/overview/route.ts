import { NextRequest, NextResponse } from "next/server";
import { apiBase, getOwnedCampaign, growfundJson, requireUser } from "../../_server";


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
    // The GrowFund overview route is public, but the dashboard proxy first verifies
    // that the requested campaign belongs to the authenticated fundraiser.
    const isAdmin = await adminRequest(auth.authorization);
    if (!isAdmin) {
      const owned = await getOwnedCampaign(req, id, auth.userId);
      if (!owned.response.ok) return NextResponse.json(owned.data, { status: owned.response.status });
      if (!owned.campaign) return NextResponse.json({ success: false, message: "Campaign not found for this fundraiser account." }, { status: 404 });
    }

    const url = new URL(`${apiBase}/campaigns/${encodeURIComponent(id)}/overview`);
    const start = req.nextUrl.searchParams.get("start_date");
    const end = req.nextUrl.searchParams.get("end_date");
    if (start) url.searchParams.set("start_date", start);
    if (end) url.searchParams.set("end_date", end);

    const { response, data } = await growfundJson(url.toString(), { method: "GET", headers: { Accept: "application/json" } });
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to load campaign overview." }, { status: 500 });
  }
}
