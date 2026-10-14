import { NextRequest, NextResponse } from "next/server";
import { apiBase, getOwnedCampaign, growfundJson, requireUser } from "../_server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  try {
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
    const owned = await getOwnedCampaign(req, id, auth.userId);
    if (!owned.response.ok) return NextResponse.json(owned.data, { status: owned.response.status });
    if (!owned.campaign) return NextResponse.json({ success: false, message: "You can only update campaigns raised by your account." }, { status: 403 });
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
