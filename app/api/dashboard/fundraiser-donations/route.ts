import { NextRequest, NextResponse } from "next/server";
import { apiBase, growfundJson, requireUser } from "../campaigns/_server";
import { extractRows, ownedCampaigns } from "../_owned";

function campaignId(r:any){return Number(r?.campaign?.id??r?.campaign_id??r?.fund_id??0);}

export async function GET(req:NextRequest){
  const auth=await requireUser(req);if("error" in auth)return auth.error;
  try{
    const campaigns=await ownedCampaigns(req,auth.userId);
    const ownedIds=new Set(campaigns.map((c:any)=>Number(c.id)).filter(Boolean));
    if(!ownedIds.size) return NextResponse.json({success:true,data:[],campaigns:[]});

    // Fetch the donation feed once and apply the ownership restriction on the server.
    // This avoids N slow WordPress requests for N campaigns.
    const q=new URLSearchParams({page:"1",per_page:"100",orderby:"id",order:"desc"});
    const {response,data}=await growfundJson(`${apiBase}/donations?${q.toString()}`,{
      method:"GET",headers:{Accept:"application/json",Authorization:auth.authorization}
    });
    if(!response.ok) return NextResponse.json(data,{status:response.status});
    const result=extractRows(data).filter((r:any)=>ownedIds.has(campaignId(r)));
    return NextResponse.json({success:true,data:result,campaigns:campaigns.map((c:any)=>({id:c.id,title:c.title}))});
  }catch(error){return NextResponse.json({success:false,message:error instanceof Error?error.message:"Unable to load fundraiser donations."},{status:500});}
}
