import { NextRequest, NextResponse } from "next/server";
import { apiBase, growfundJson, requireUser } from "../campaigns/_server";
import { extractRows, ownedCampaigns } from "../_owned";

function first(r:any,...keys:string[]){for(const k of keys){const p=k.split(".");let v=r;for(const x of p)v=v?.[x];if(v!==undefined&&v!==null&&v!=="")return v;}return undefined;}
function campaignId(r:any){return Number(first(r,"campaign.id","campaign_id","fund_id")??0);}
function amount(r:any){const v=Number(first(r,"amount","donation_amount","total","gross_amount","order_total"));return Number.isFinite(v)?v:0;}
function dateRaw(r:any){return first(r,"created_at","date_created","date","created","paid_at","completed_at");}
function dateTime(v:any){const d=v?new Date(v):null;return d&&!Number.isNaN(d.getTime())?d.getTime():0;}
function isCompleted(r:any){const st=String(first(r,"status","payment_status","donation_status")??"").toLowerCase();return ["completed","complete","paid","approved","success","successful"].includes(st);}
function isAnonymous(r:any){const v=first(r,"is_anonymous","anonymous");return v===true||v===1||v==="1"||String(v).toLowerCase()==="true";}
function donorKey(r:any){if(isAnonymous(r))return `anonymous:${first(r,"id","donation_id","uid")??Math.random()}`;const id=first(r,"donor.id","user.id","user_id","donor_id");if(id!==undefined&&id!==null&&String(id)!==""&&String(id)!=="0")return `id:${String(id)}`;const email=String(first(r,"donor.email","user.email","email","user_email")??"").trim().toLowerCase();if(email)return `email:${email}`;return `guest:${first(r,"id","donation_id","uid")??Math.random()}`;}
function donorObject(r:any){if(isAnonymous(r))return {id:0,first_name:"Anonymous",last_name:"",display_name:"Anonymous",email:"",phone:"",date_created:dateRaw(r)};const d=r?.donor??r?.user??{};return {id:Number(d?.id??first(r,"donor_id","user_id")??0),first_name:d?.first_name??first(r,"first_name"),last_name:d?.last_name??first(r,"last_name"),display_name:d?.display_name??d?.name??first(r,"donor_name","name"),email:d?.email??first(r,"email","user_email"),phone:d?.phone??first(r,"phone"),date_created:d?.joined_at??d?.date_created??d?.created_at??d?.registered_at??d?.user_registered??first(r,"joined_at","user_registered")};}

export async function GET(req:NextRequest){
  const auth=await requireUser(req);if("error" in auth)return auth.error;
  try{
    const campaigns=await ownedCampaigns(req,auth.userId);const ownedIds=new Set(campaigns.map((c:any)=>Number(c.id)).filter(Boolean));
    if(!ownedIds.size)return NextResponse.json({success:true,data:[]});
    const q=new URLSearchParams({page:"1",per_page:"100",orderby:"id",order:"desc",status:"completed"});
    for (const key of ["start_date","end_date"] as const) { const value=req.nextUrl.searchParams.get(key); if(value) q.set(key,value); }
    const {response,data}=await growfundJson(`${apiBase}/donations?${q.toString()}`,{method:"GET",headers:{Accept:"application/json",Authorization:auth.authorization}});
    if(!response.ok)return NextResponse.json(data,{status:response.status});
    const donations=extractRows(data).filter((r:any)=>ownedIds.has(campaignId(r))&&isCompleted(r));
    const map=new Map<string,any>();
    for(const r of donations){
      const key=donorKey(r),base=donorObject(r),raw=dateRaw(r),prev=map.get(key),value=amount(r);
      if(!prev){map.set(key,{...base,donations_count:1,total_given:value,currency:"USD",latest_donation:{amount:value,currency:"USD",date:raw},date_created:base.date_created||raw});continue;}
      const latest=dateTime(raw)>dateTime(prev.latest_donation?.date)?{amount:value,currency:"USD",date:raw}:prev.latest_donation;
      map.set(key,{...prev,...Object.fromEntries(Object.entries(base).filter(([,v])=>v!==undefined&&v!==null&&v!=="")),donations_count:Number(prev.donations_count||0)+1,total_given:Number(prev.total_given||0)+value,currency:"USD",latest_donation:latest,date_created:prev.date_created||base.date_created||raw});
    }
    return NextResponse.json({success:true,data:Array.from(map.values()).sort((a,b)=>Number(b.total_given||0)-Number(a.total_given||0))});
  }catch(error){return NextResponse.json({success:false,message:error instanceof Error?error.message:"Unable to load fundraiser donors."},{status:500});}
}
