import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";
const API_KEY = process.env.GROWFUND_CLIENT_API_KEY || process.env.NEXT_PUBLIC_GROWFUND_CLIENT_API_KEY || "";

export async function GET(request: NextRequest) {
  if (!API_KEY) return NextResponse.json({ success:false, message:"GROWFUND_CLIENT_API_KEY is not configured" }, { status:500 });
  try {
    const tokenRes = await fetch(`${WORDPRESS_API}/auth/system-token`, { method:"POST", headers:{Accept:"application/json","Content-Type":"application/json","X-API-Key":API_KEY}, cache:"no-store" });
    const tokenData = await tokenRes.json().catch(()=>null);
    const systemToken = tokenData?.system_access_token;
    if (!tokenRes.ok || !systemToken) return NextResponse.json(tokenData || {success:false,message:"Unable to obtain system token"},{status:tokenRes.ok?502:tokenRes.status});
    const target = new URL(`${WORDPRESS_API}/campaign/updates/paginated`);
    request.nextUrl.searchParams.forEach((value,key)=>target.searchParams.set(key,value));
    const response = await fetch(target, { headers:{Accept:"application/json",Authorization:`Bearer ${systemToken}`,"X-API-Key":API_KEY}, cache:"no-store" });
    const text = await response.text();
    let data:any=null; try{data=text?JSON.parse(text):null}catch{data={success:false,message:"WordPress returned invalid JSON"}}
    return NextResponse.json(data,{status:response.status});
  } catch(error) { return NextResponse.json({success:false,message:error instanceof Error?error.message:"Unable to load campaign updates"},{status:500}); }
}
