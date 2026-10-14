import { NextRequest, NextResponse } from "next/server";
import { apiBase, getOwnedCampaign, growfundJson, requireUser } from "../_server";

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.map(Number).filter(Boolean) : [];
  if (!ids.length) return NextResponse.json({ success:false, message:"No campaign IDs were supplied." }, { status:400 });
  for (const id of ids) {
    const owned = await getOwnedCampaign(req, id, auth.userId);
    if (!owned.response.ok || !owned.campaign) return NextResponse.json({ success:false, message:`Campaign #${id} is not available to this account.` }, { status:403 });
  }
  try {
    const {response,data}=await growfundJson(`${apiBase}/campaigns/bulk-action`,{method:"POST",headers:{Accept:"application/json",Authorization:auth.authorization,"Content-Type":"application/json"},body:JSON.stringify({ids,action:String(body?.action||"")})});
    return NextResponse.json(data,{status:response.status});
  } catch(error) {
    return NextResponse.json({success:false,message:error instanceof Error?error.message:"Campaign action failed."},{status:500});
  }
}
