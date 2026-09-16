"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { isDateInRange, type DateRangeKey } from "@/lib/dashboard/dateRanges";
import { campaignImage } from "@/lib/dashboard/campaignMedia";
import { Icon } from "@iconify/react";

function value(r:any,...keys:string[]){for(const k of keys){if(r?.[k]!==undefined&&r?.[k]!==null)return r[k];}return undefined;}
function campaignId(r:any){return Number(r?.campaign?.id ?? value(r,"campaign_id","fund_id") ?? 0);}
function rawDate(r:any){return value(r,"created_at","date_created","date","created");}
function dateValue(r:any){const raw=rawDate(r);const d=raw?new Date(raw):null;return d&&!Number.isNaN(d.getTime())?d.toLocaleDateString():"—";}

export default function FundraiserDonations(){
  const router=useRouter();
  const [campaigns,setCampaigns]=useState<any[]>([]); const [rows,setRows]=useState<any[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const [dateRange,setDateRange]=useState<DateRangeKey>("this_year"); const [campaignFilter,setCampaignFilter]=useState("");
  useEffect(()=>{(async()=>{try{
    const token=localStorage.getItem("access_token")||"";
    const res=await fetch("/api/dashboard/fundraiser-donations",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
    const json=await res.json(); if(!res.ok) throw new Error(json?.message||"Unable to load donations.");
    setCampaigns(Array.isArray(json?.campaigns)?json.campaigns:[]); setRows(Array.isArray(json?.data)?json.data:[]);
  }catch(e){setError(e instanceof Error?e.message:"Unable to load donations.");}finally{setLoading(false);}})();},[]);
  const names=useMemo(()=>new Map(campaigns.map(c=>[Number(c.id),c.title||`Campaign #${c.id}`])),[campaigns]);
  const visibleRows=useMemo(()=>rows.filter(r=>isDateInRange(rawDate(r),dateRange)&&(!campaignFilter||String(campaignId(r))===campaignFilter)),[rows,dateRange,campaignFilter]);
  return <CardBox><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h5 className="card-title">Donations</h5><p className="mt-1 text-sm text-darklink">Donations received by your campaigns only.</p></div><div className="flex gap-2"><select value={campaignFilter} onChange={e=>setCampaignFilter(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5"><option value="">All Campaigns</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.title||`Campaign #${c.id}`}</option>)}</select><DatePresetSelect value={dateRange} onChange={setDateRange}/></div></div>{error&&<div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}<div className="mt-5 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Donation</TableHead><TableHead>Campaign</TableHead><TableHead>Donor</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{loading?<TableRow><TableCell colSpan={7} className="py-10 text-center text-darklink">Loading donations…</TableCell></TableRow>:visibleRows.length?visibleRows.map((r,i)=>{const status=String(value(r,"payment_status","status")??"unknown");const cid=campaignId(r);const donor=r?.donor??r?.user??{};const donorName=[donor?.first_name,donor?.last_name].filter(Boolean).join(" ")||value(r,"donor_name","name")||donor?.display_name||value(r,"email")||"Anonymous";const donorFirst=String(donor?.first_name||value(r,"first_name")||donorName).trim().split(/\s+/)[0]||"Anonymous";const did=value(r,"id","donation_id");return <TableRow key={String(did??i)} className="cursor-pointer" onClick={()=>did&&router.push(`/dashboard/donations/${did}`)}><TableCell className="font-medium"><button className="hover:text-primary" onClick={(e)=>{e.stopPropagation();did&&router.push(`/dashboard/donations/${did}`)}}>#{did??"—"}</button></TableCell><TableCell><div className="flex items-center gap-3">{campaignImage(r)?<img src={campaignImage(r)} alt="" className="h-10 w-10 rounded-md object-cover"/>:<span className="h-10 w-10 shrink-0 rounded-md bg-lightgray"/>}<span>{r?.campaign?.title??names.get(cid)??`Campaign #${cid||"—"}`}</span></div></TableCell><TableCell><div className="flex items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon="solar:user-rounded-line-duotone" height={18}/></span><span>{donorFirst}</span></div></TableCell><TableCell>${Number(value(r,"amount","donation_amount","total")??0).toFixed(2)}</TableCell><TableCell><Badge variant={["paid","completed","successful","success"].includes(status.toLowerCase())?"lightSuccess":"lightPrimary"}>{status}</Badge></TableCell><TableCell>{dateValue(r)}</TableCell><TableCell className="text-right"><button className="text-sm font-medium text-primary hover:underline" onClick={(e)=>{e.stopPropagation();did&&router.push(`/dashboard/donations/${did}`)}}>View donation</button></TableCell></TableRow>}):<TableRow><TableCell colSpan={7} className="py-10 text-center text-darklink">No donations found for this period.</TableCell></TableRow>}</TableBody></Table></div></CardBox>;
}
