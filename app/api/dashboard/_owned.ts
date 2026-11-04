import { NextRequest } from "next/server";
import { apiBase, combinedHeaders, getSystemToken, growfundJson } from "./campaigns/_server";

function extractRows(data:any):any[]{
  if(Array.isArray(data)) return data;
  if(Array.isArray(data?.data)) return data.data;
  if(Array.isArray(data?.data?.data)) return data.data.data;
  if(Array.isArray(data?.paginated?.results)) return data.paginated.results;
  if(Array.isArray(data?.results)) return data.results;
  if(Array.isArray(data?.items)) return data.items;
  return [];
}

export function userRoles(userResponse:any){
  const source=userResponse?.data ?? userResponse ?? {};
  const raw=source?.roles ?? source?.role ?? source?.user_roles ?? [];
  return (Array.isArray(raw)?raw:[raw]).map((r:any)=>String(r).toLowerCase());
}
export function isAdminUser(userResponse:any){return userRoles(userResponse).some((r:string)=>["administrator","admin","shop_manager"].includes(r));}
export function belongsToUser(c:any,userId:number){
  return [c?.author?.id,c?.author_id,c?.fundraiser?.id,c?.fundraiser_id,c?.user_id,c?.created_by,c?.owner_id]
    .map(Number).filter(Boolean).includes(userId);
}

// One backend request instead of one request per campaign status. This is important on
// Cloudflare/WordPress where each REST request can take several seconds.
export async function ownedCampaigns(req:NextRequest,userId:number){
  const systemToken=await getSystemToken(req.nextUrl.origin);
  const qs=new URLSearchParams({page:"1",per_page:"100",status:"all"});
  const {response,data}=await growfundJson(`${apiBase}/campaigns?${qs.toString()}`,{
    method:"GET",headers:combinedHeaders(systemToken)
  });
  if(!response.ok) throw new Error(data?.message||data?.data?.message||"Unable to load campaigns.");
  const byId=new Map<number,any>();
  extractRows(data).filter(c=>belongsToUser(c,userId)).forEach(c=>byId.set(Number(c.id),c));
  return Array.from(byId.values()).sort((a,b)=>Number(b?.id||0)-Number(a?.id||0));
}

export { extractRows };
