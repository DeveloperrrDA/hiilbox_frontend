import { NextRequest, NextResponse } from "next/server";
import { apiBase, getOwnedCampaign, growfundJson, requireUser } from "../../_server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  try {
    // The GrowFund overview route is public, but the dashboard proxy first verifies
    // that the requested campaign belongs to the authenticated fundraiser.
    const owned = await getOwnedCampaign(req, id, auth.userId);
    if (!owned.response.ok) return NextResponse.json(owned.data, { status: owned.response.status });
    if (!owned.campaign) return NextResponse.json({ success: false, message: "Campaign not found for this fundraiser account." }, { status: 404 });

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
