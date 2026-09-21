"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import { Icon } from "@iconify/react";
import { dashboardRole, savedDashboardUser, type DashboardRole } from "@/lib/dashboard/roles";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { getDateRange, isDateInRange, type DateRangeKey } from "@/lib/dashboard/dateRanges";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function rows(v:any):any[]{if(Array.isArray(v))return v;if(Array.isArray(v?.data?.results))return v.data.results;if(Array.isArray(v?.data))return v.data;if(Array.isArray(v?.data?.data))return v.data.data;if(Array.isArray(v?.donations))return v.donations;if(Array.isArray(v?.donors))return v.donors;if(Array.isArray(v?.campaigns))return v.campaigns;if(Array.isArray(v?.paginated?.results))return v.paginated.results;if(Array.isArray(v?.results))return v.results;return [];}
function first(r:any,...keys:string[]){for(const k of keys){const parts=k.split(".");let v=r;for(const p of parts)v=v?.[p];if(v!==undefined&&v!==null&&v!=="")return v;}return undefined;}
function num(r:any,...keys:string[]){const v=Number(first(r,...keys));return Number.isFinite(v)?v:0;}
function donationId(r:any){return String(first(r,"id","donation_id","uid")??"");}
function donationAmount(r:any){return num(r,"amount","donation_amount","total","gross_amount","order_total");}
function donationNet(r:any){const direct=first(r,"net_amount","amount_after_fees","net","net_donation");if(direct!==undefined){const n=Number(direct);return Number.isFinite(n)?n:0;}const gross=donationAmount(r);const gateway=num(r,"gateway_fee","payment_gateway_fee")/100;const platform=num(r,"platform_fee")/100;return Math.max(0,gross-gateway-platform);}
function donationStatus(r:any){return String(first(r,"payment_status","status","order_status")??"").toLowerCase();}
function isSuccessful(r:any){return String(r?.payment_status??"").trim().toLowerCase()==="paid";}
function donationDate(r:any){const raw=first(r,"created_at","date_created","date","created","paid_at","completed_at");const d=raw?new Date(raw):null;return d&&!Number.isNaN(d.getTime())?d:null;}
function campaignId(r:any){return Number(r?.campaign?.id??r?.campaign_id??0);}
function campaignTitle(r:any){return String(first(r,"campaign.title","campaign_name","campaign_title","fund_title")??"");}
function donorKey(r:any){return String(first(r,"donor.id","user.id","user_id","donor_id","email","donor.email","user.email","user_email")??`anonymous:${donationId(r)}`);}
function donorName(r:any){const d=r?.donor??r?.user??{};const joined=[d?.first_name,d?.last_name].filter(Boolean).join(" ");return String(joined||first(r,"donor_name","name","display_name","donor.display_name","user.display_name","email","donor.email","user_email")||"Anonymous");}
function donorFirstName(r:any){const d=r?.donor??r?.user??{};return String(d?.first_name||first(r,"first_name")||donorName(r)).trim().split(/\s+/)[0]||"Anonymous";}
function donorEmail(r:any){return String(first(r,"email","donor.email","user.email","user_email")??"");}
function campaignName(c:any){return String(first(c,"title","name","post_title")??`Campaign #${first(c,"id")??""}`);}
function campaignGoal(c:any){return num(c,"goal_amount","goal","target_amount","funding_goal");}
function money(v:number){return `$${v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;}
function formatDate(d:Date|null){return d?d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}):"—";}
function dayKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function bucketData(donations:any[],range:DateRangeKey,mode:"revenue"|"donors"){
  const {start,end}=getDateRange(range);
  const startDay=new Date(start);startDay.setHours(0,0,0,0);
  const endDay=new Date(end);endDay.setHours(0,0,0,0);
  const days=Math.max(1,Math.round((endDay.getTime()-startDay.getTime())/86400000)+1);
  const count=days<=2?days:days<=7?days:days<=31?10:days<=100?12:12;
  const bucketDays=Math.max(1,Math.ceil(days/count));
  const result:{label:string;value:number;keys:Set<string>;start:Date;end:Date}[]=[];
  for(let i=0;i<count;i++){const a=new Date(startDay);a.setDate(startDay.getDate()+i*bucketDays);if(a>endDay)break;const b=new Date(a);b.setDate(a.getDate()+bucketDays-1);if(b>endDay)b.setTime(endDay.getTime());const label=b.getTime()===a.getTime()?a.toLocaleDateString(undefined,{month:"short",day:"numeric"}):`${a.toLocaleDateString(undefined,{month:"short",day:"numeric"})} - ${b.toLocaleDateString(undefined,{month:"short",day:"numeric"})}`;result.push({label,value:0,keys:new Set(),start:a,end:b});}
  for(const r of donations){if(!isSuccessful(r))continue;const d=donationDate(r);if(!d||!isDateInRange(d,range))continue;const bucket=result.find(b=>d.getTime()>=b.start.getTime()&&d.getTime()<=new Date(b.end.getFullYear(),b.end.getMonth(),b.end.getDate(),23,59,59,999).getTime());if(!bucket)continue;if(mode==="revenue")bucket.value+=donationAmount(r);else bucket.keys.add(donorKey(r));}
  return result.map(b=>({label:b.label,value:mode==="revenue"?b.value:b.keys.size}));
}

function metricNumber(value:any):number|undefined{if(value===undefined||value===null||value==="")return undefined;const direct=Number(value);if(Number.isFinite(direct))return direct;if(typeof value==="object"){for(const key of ["value","amount","total","count","data"]){const n=metricNumber(value?.[key]);if(n!==undefined)return n;}}return undefined;}
function deepMetric(input:any,keys:string[]):number|undefined{if(!input||typeof input!=="object")return undefined;const wanted=keys.map(k=>k.toLowerCase().replace(/[^a-z0-9]/g,""));if(Array.isArray(input)){for(const item of input){const label=String(item?.key??item?.name??item?.label??item?.title??item?.metric??"").toLowerCase().replace(/[^a-z0-9]/g,"");if(label&&wanted.includes(label)){const n=metricNumber(item?.value??item?.amount??item?.total??item?.count??item?.data);if(n!==undefined)return n;}const nested=deepMetric(item,keys);if(nested!==undefined)return nested;}return undefined;}for(const [key,v] of Object.entries(input)){const normalized=key.toLowerCase().replace(/[^a-z0-9]/g,"");if(wanted.includes(normalized)){const n=metricNumber(v);if(n!==undefined)return n;}}for(const v of Object.values(input)){if(v&&typeof v==="object"){const n=deepMetric(v,keys);if(n!==undefined)return n;}}return undefined;}

export default function RoleAnalytics(){
  const [role,setRole]=useState<DashboardRole>("guest");
  const [donations,setDonations]=useState<any[]>([]);const[donors,setDonors]=useState<any[]>([]);const[campaigns,setCampaigns]=useState<any[]>([]);const[backendStats,setBackendStats]=useState<any>(null);
  const [range,setRange]=useState<DateRangeKey>("this_year");const[startDate,setStartDate]=useState("");const[endDate,setEndDate]=useState("");const[loading,setLoading]=useState(true);const[error,setError]=useState("");
  useEffect(()=>setRole(dashboardRole(savedDashboardUser())),[]);
  useEffect(()=>{if(!["fundraiser","admin"].includes(role))return;void (async()=>{setLoading(true);setError("");try{const token=localStorage.getItem("access_token")||"";const headers={Authorization:`Bearer ${token}`};if(role==="fundraiser"){
      const [dr,cr]=await Promise.all([fetch("/api/dashboard/fundraiser-donations",{headers,cache:"no-store"}),fetch("/api/dashboard/campaigns",{headers,cache:"no-store"})]);
      const [dj,cj]=await Promise.all([dr.json(),cr.json()]);if(!dr.ok)throw new Error(dj?.message||"Unable to load donations.");if(!cr.ok)throw new Error(cj?.message||"Unable to load campaigns.");setDonations(rows(dj));setDonors([]);setCampaigns(rows(cj));setBackendStats(null);
    }else{
      // GrowFund campaign data confirms this admin account is author/fundraiser ID 1.
      // Only those campaigns are included in Admin Analytics.
      const ADMIN_GROWFUND_ID=1;

      const cr=await fetch("/api/admin/growfund/campaigns?page=1&per_page=100&status=all",{headers,cache:"no-store"});
      const cj=await cr.json().catch(()=>null);
      if(!cr.ok)throw new Error(cj?.message||"Unable to load admin campaigns.");

      const owned=rows(cj).filter((c:any)=>{
        const authorId=Number(c?.author?.id??0);
        const fundraiserId=Number(c?.fundraiser?.id??0);
        return authorId===ADMIN_GROWFUND_ID||fundraiserId===ADMIN_GROWFUND_ID;
      });

      setCampaigns(owned);setDonors([]);setBackendStats(null);

      // Fetch each owned campaign's donations. rows() handles GrowFund data.results.
      const batches=await Promise.all(owned.map(async(c:any)=>{
        const cid=Number(c?.id??0);
        if(!cid)return[];
        const q=new URLSearchParams({page:"1",per_page:"100",campaign_id:String(cid),orderby:"id",order:"desc"});
        const r=await fetch(`/api/admin/growfund/donations/paginated?${q.toString()}`,{headers,cache:"no-store"});
        const j=await r.json().catch(()=>null);
        if(!r.ok)throw new Error(j?.message||`Unable to load donations for campaign #${cid}.`);
        return rows(j);
      }));

      // Deduplicate by donation ID and keep only paid donations.
      const seen=new Set<string>();
      const scoped=batches.flat().filter((d:any)=>{
        const key=donationId(d);
        if(key&&seen.has(key))return false;
        if(key)seen.add(key);
        return true;
      }).filter(isSuccessful);

      setDonations(scoped);
    }}catch(e){setError(e instanceof Error?e.message:"Unable to load analytics.");setDonations([]);setCampaigns([]);}finally{setLoading(false);}})();},[role]);

  const filtered=useMemo(()=>donations.filter(r=>{const d=donationDate(r);if(!d)return false;if(startDate&&d<new Date(`${startDate}T00:00:00`))return false;if(endDate&&d>new Date(`${endDate}T23:59:59`))return false;return isDateInRange(d,range);}),[donations,range,startDate,endDate]);
  const successful=useMemo(()=>filtered.filter(isSuccessful),[filtered]);
  const stats=useMemo(()=>{const total=successful.reduce((sum,r)=>sum+donationAmount(r),0);const net=successful.reduce((sum,r)=>sum+donationNet(r),0);const average=successful.length?total/successful.length:0;const unique=new Set(successful.map(donorKey));return{total,net,average,donors:unique.size};},[successful]);
  const revenue=useMemo(()=>bucketData(donations,range,"revenue"),[donations,range]);
  const donorTrend=useMemo(()=>bucketData(donations,range,"donors"),[donations,range]);
  const topCampaigns=useMemo(()=>{const map=new Map<number,{id:number,title:string,total:number,count:number,donors:Set<string>,goal:number}>();for(const c of campaigns){const id=Number(c?.id||0);if(id)map.set(id,{id,title:campaignName(c),total:0,count:0,donors:new Set(),goal:campaignGoal(c)});}for(const r of successful){const id=campaignId(r);if(!id)continue;const x=map.get(id)||{id,title:campaignTitle(r)||`Campaign #${id}`,total:0,count:0,donors:new Set<string>(),goal:0};x.total+=donationAmount(r);x.count++;x.donors.add(donorKey(r));map.set(id,x);}return [...map.values()].sort((a,b)=>b.total-a.total).slice(0,5);},[campaigns,successful]);
  const topDonors=useMemo(()=>{const map=new Map<string,{key:string,name:string,email:string,total:number,count:number}>();for(const r of successful){const key=donorKey(r);const x=map.get(key)||{key,name:donorName(r),email:donorEmail(r),total:0,count:0};x.total+=donationAmount(r);x.count++;map.set(key,x);}return[...map.values()].sort((a,b)=>b.total-a.total).slice(0,5);},[successful]);
  const recent=useMemo(()=>[...filtered].sort((a,b)=>(donationDate(b)?.getTime()||0)-(donationDate(a)?.getTime()||0)).slice(0,6),[filtered]);
  if(role==="donor"||role==="guest")return <div className="rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">Analytics are available to administrators and fundraisers.</div>;

  const revenueOptions:any={chart:{toolbar:{show:false},fontFamily:"inherit",zoom:{enabled:false}},stroke:{curve:"smooth",width:3},dataLabels:{enabled:false},grid:{borderColor:"rgba(120,130,140,.18)"},xaxis:{categories:revenue.map(x=>x.label),axisBorder:{show:false},axisTicks:{show:false},labels:{style:{colors:"#7c8798"}}},yaxis:{min:0,labels:{formatter:(v:number)=>money(v),style:{colors:"#7c8798"}}},tooltip:{y:{formatter:(v:number)=>money(v)}},colors:["#2f915c"],fill:{type:"gradient",gradient:{opacityFrom:.18,opacityTo:.02}}};
  const donorOptions:any={chart:{toolbar:{show:false},fontFamily:"inherit",zoom:{enabled:false}},stroke:{curve:"smooth",width:2},dataLabels:{enabled:false},grid:{borderColor:"rgba(120,130,140,.16)"},xaxis:{categories:donorTrend.map(x=>x.label),tickAmount:4,labels:{hideOverlappingLabels:true,style:{colors:"#7c8798"}}},yaxis:{min:0,forceNiceScale:true,labels:{formatter:(v:number)=>String(Math.round(v)),style:{colors:"#7c8798"}}},tooltip:{y:{formatter:(v:number)=>`${Math.round(v)} donor${Math.round(v)===1?"":"s"}`}},colors:["#9b63ff"],fill:{type:"gradient",gradient:{opacityFrom:.2,opacityTo:.02}}};
  const cards=[{label:"Total Donation",value:money(stats.total),bg:"bg-[#e6f5fc]",icon:"solar:hand-money-line-duotone"},{label:"Net Donation",value:money(stats.net),bg:"bg-[#e7f7ef]",icon:"solar:wallet-money-line-duotone"},{label:"Average Donation",value:money(stats.average),bg:"bg-[#f3eafd]",icon:"solar:chart-2-line-duotone"},{label:"Total Donors",value:String(stats.donors),bg:"bg-[#fff4c9]",icon:"solar:users-group-rounded-line-duotone"}];
  return <div className="space-y-7">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-semibold text-dark dark:text-white">Overview</h2><p className="mt-1 text-sm text-darklink">{role==="fundraiser"?"Real performance data from donations to your campaigns only.":"Performance from campaigns created by this admin account only."}</p></div><div className="flex flex-wrap gap-2"><DatePresetSelect value={range} onChange={setRange} className="bg-white dark:bg-darkgray"/><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} aria-label="Start Date" className="rounded-md border border-ld bg-white px-3 py-2.5 dark:bg-darkgray"/><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} aria-label="End Date" className="rounded-md border border-ld bg-white px-3 py-2.5 dark:bg-darkgray"/></div></div>
    {error&&<div className="rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
    <div className="grid grid-cols-12 gap-6">{cards.map(c=><div key={c.label} className={`col-span-12 rounded-2xl p-6 sm:col-span-6 xl:col-span-3 ${c.bg} dark:bg-darkgray`}><div className="flex items-start justify-between"><div><p className="text-base text-darklink">{c.label}</p><h3 className="mt-3 text-3xl font-medium text-dark dark:text-white">{loading?"…":c.value}</h3></div><Icon icon={c.icon} height={28} className="text-darklink"/></div></div>)}</div>
    <CardBox><h5 className="card-title">Revenue for Period</h5><div className="mt-4 min-h-[330px]">{loading?<div className="flex h-[330px] items-center justify-center text-sm text-darklink">Loading revenue…</div>:<Chart options={revenueOptions} series={[{name:"Revenue",data:revenue.map(x=>Number(x.value.toFixed(2)))}]} type="area" height={330}/>}</div></CardBox>
    <div className="grid grid-cols-12 gap-7"><CardBox className="col-span-12 lg:col-span-8"><div className="flex items-center justify-between"><h5 className="card-title">Top Campaigns</h5><Link href="/dashboard/campaigns" className="flex items-center gap-2 text-sm font-semibold text-dark hover:text-primary"><Icon icon="solar:document-text-line-duotone" height={19}/> See All Campaigns</Link></div><div className="mt-6 space-y-6">{topCampaigns.length?topCampaigns.map(c=>{const pct=c.goal>0?Math.min(100,c.total/c.goal*100):0;return <div key={c.id}><div className="flex items-start justify-between gap-4"><div className="min-w-0"><Link href={`/dashboard/campaigns/${c.id}/overview`} className="font-medium text-dark hover:text-primary dark:text-white">{c.title}</Link><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-primary" style={{width:`${pct}%`}}/></div><div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-darklink"><strong className="font-medium text-dark dark:text-white">{money(c.total)}</strong>{c.goal>0&&<span>of {money(c.goal)}</span>}<span>•</span><span>{c.donors.size} Donors</span><span>•</span><span>{c.count} Donation{c.count===1?"":"s"}</span></div></div></div></div>}):<p className="py-12 text-center text-sm text-darklink">No campaign donations in this period.</p>}</div></CardBox>
      <CardBox className="col-span-12 lg:col-span-4"><h5 className="card-title">Donor Over Time</h5><div className="mt-4 min-h-[300px]">{loading?<div className="flex h-[300px] items-center justify-center text-sm text-darklink">Loading donors…</div>:<Chart options={donorOptions} series={[{name:"Donors",data:donorTrend.map(x=>x.value)}]} type="area" height={300}/>}</div></CardBox></div>
    <div className="grid grid-cols-12 gap-7"><CardBox className="col-span-12 lg:col-span-6"><h5 className="card-title">Top Donors</h5><div className="mt-5 divide-y divide-ld">{topDonors.length?topDonors.map(d=><div key={d.key} className="flex items-center justify-between gap-4 py-4 first:pt-0"><div className="min-w-0"><p className="truncate font-medium text-dark dark:text-white">{d.name}</p><p className="mt-1 truncate text-sm text-darklink">{d.count} donation{d.count===1?"":"s"}{d.email?` · ${d.email}`:""}</p></div><span className="rounded-md bg-lightprimary px-3 py-1.5 text-sm font-semibold text-primary">{money(d.total)}</span></div>):<p className="py-10 text-center text-sm text-darklink">No donors in this period.</p>}</div></CardBox>
      <CardBox className="col-span-12 lg:col-span-6"><h5 className="card-title">Recent Donations</h5><div className="mt-5 divide-y divide-ld">{recent.length?recent.map(r=><div key={donationId(r)} className="flex items-start justify-between gap-4 py-4 first:pt-0"><div className="min-w-0"><div className="flex items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon="solar:user-rounded-line-duotone" height={18}/></span><p className="truncate font-medium text-dark dark:text-white">{donorFirstName(r)}</p></div><p className="mt-1 truncate text-sm text-darklink">{campaignTitle(r)||campaignName(campaigns.find(c=>Number(c.id)===campaignId(r))||{id:campaignId(r)})} · {formatDate(donationDate(r))}</p></div><div className="text-right"><span className="rounded-md bg-lightsuccess px-2.5 py-1 text-sm font-semibold text-success">{money(donationAmount(r))}</span>{donationStatus(r)&&<p className="mt-2 text-xs capitalize text-darklink">{donationStatus(r)}</p>}</div></div>):<p className="py-10 text-center text-sm text-darklink">No recent donations in this period.</p>}</div></CardBox></div>
  </div>;
}
