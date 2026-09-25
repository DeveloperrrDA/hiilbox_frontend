"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import {
  isDateInRange,
  type DateRangeKey,
} from "@/lib/dashboard/dateRanges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

function idOf(r:any){return Number(r?.id??r?.user_id??r?.donor_id??0);}
function nameOf(r:any){return [r?.first_name,r?.last_name].filter(Boolean).join(" ")||r?.display_name||r?.name||r?.username||r?.user_login||"";}
function count(r:any){return Number(r?.donations_count??r?.donation_count??r?.total_donations??r?.donations?.length??0);}
function total(r:any){return Number(r?.total_given??r?.total_donated??r?.donation_total??r?.total_amount??0);}
function latest(r:any){return r?.latest_donation??r?.last_donation??r?.latest_donation_amount??r?.last_donation_amount;}
function created(r:any){return r?.date_created??r?.created_at??r?.registered_at??r?.user_registered;}
function fmtDate(v:any){if(!v)return "—";const d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleDateString();}
function money(v:any,currency:any="$ "){const n=Number(v??0);const c=String(currency||"");if(/^[A-Z]{3}$/.test(c)){try{return new Intl.NumberFormat(undefined,{style:"currency",currency:c}).format(n);}catch{}}return `${c||"$ "}${n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;}

export default function FundraiserDonors(){
const [rows, setRows] = useState<any[]>([]);
const [campaigns, setCampaigns] = useState<any[]>([]);
const [campaignFilter, setCampaignFilter] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [dateRange, setDateRange] = useState<DateRangeKey>("all");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [page, setPage] = useState(1);  const load=useCallback(async()=>{setLoading(true);setError("");try{const token=localStorage.getItem("access_token")||"";const q=new URLSearchParams();if(startDate)q.set("start_date",startDate);if(endDate)q.set("end_date",endDate);if(campaignFilter)q.set("campaign_id",campaignFilter);const res=await fetch(`/api/dashboard/fundraiser-donors?${q}`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});const json=await res.json();if(!res.ok)throw new Error(json?.message||"Unable to load donors.");setRows(Array.isArray(json?.data)?json.data:[]);
  }catch(e){setError(e instanceof Error?e.message:"Unable to load donors.");}finally{setLoading(false);}},[startDate,endDate,campaignFilter]);
  useEffect(()=>{void load();},[load]);
useEffect(
  () => setPage(1),
  [campaignFilter, dateRange, startDate, endDate]
);const filteredRows = useMemo(() => {
  return rows.filter((r) => {
    const raw = created(r);
    const d = raw ? new Date(raw) : null;

    if (
      startDate &&
      (!d || d < new Date(`${startDate}T00:00:00`))
    ) {
      return false;
    }

    if (
      endDate &&
      (!d || d > new Date(`${endDate}T23:59:59`))
    ) {
      return false;
    }

    if (!isDateInRange(raw, dateRange)) {
      return false;
    }

    return true;
  });
}, [rows, dateRange, startDate, endDate]);

const pages = Math.max(1, Math.ceil(filteredRows.length / 10));

const visible = useMemo(
  () => filteredRows.slice((page - 1) * 10, page * 10),
  [filteredRows, page]
);  useEffect(()=>{const token=localStorage.getItem("access_token")||"";fetch("/api/dashboard/campaigns",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"}).then(r=>r.json()).then(x=>setCampaigns(Array.isArray(x?.data)?x.data:[])).catch(()=>{});},[]);
  return <CardBox className="w-full !max-w-none"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h5 className="card-title">Donors</h5><p className="mt-1 text-sm text-darklink">People who donated to your campaigns during the selected period.</p></div><div className="flex gap-2"><select value={campaignFilter} onChange={e=>setCampaignFilter(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5"><option value="">All Campaigns</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.title||`Campaign #${c.id}`}</option>)}</select><DatePresetSelect
  value={dateRange}
  onChange={setDateRange}
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/></div></div>
{(campaignFilter || dateRange !== "all" || startDate || endDate) && (
  <div className="mt-3 flex flex-wrap items-center gap-2">
    <span className="text-sm font-medium">Active filters:</span>

    {campaignFilter && (
      <button
        type="button"
        onClick={() => setCampaignFilter("")}
        className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray"
      >
        Campaign:{" "}
        {campaigns.find(
          (c) => String(c.id) === campaignFilter
        )?.title || `Campaign #${campaignFilter}`}{" "}
        ×
      </button>
    )}

    {dateRange !== "all" && (
      <button
        type="button"
        onClick={() => {
          setDateRange("all");
          setStartDate("");
          setEndDate("");
        }}
        className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray"
      >
        {dateRange === "custom"
          ? `Date: ${startDate || "…"} – ${endDate || "…"}`
          : `Date: ${dateRange.replaceAll("_", " ")}`}{" "}
        ×
      </button>
    )}

    <button
      type="button"
      onClick={() => {
        setCampaignFilter("");
        setDateRange("all");
        setStartDate("");
        setEndDate("");
        setPage(1);
      }}
      className="text-xs font-medium text-primary hover:underline"
    >
      Clear all
    </button>
  </div>
)}
{error&&<div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}<div className="mt-4 flex justify-end"><ColumnVisibilityControl tableClass="fundraiser-donors-table" columns={["Donor Details", "Donations", "Total Given", "Latest Donation", "Date Created"]}/></div><div className="mt-5 overflow-x-auto"><Table className="fundraiser-donors-table"><TableHeader><TableRow><TableHead>Donor Details</TableHead><TableHead>Donations</TableHead><TableHead>Total Given</TableHead><TableHead>Latest Donation</TableHead><TableHead>Date Created</TableHead></TableRow></TableHeader><TableBody>{loading?<TableRow><TableCell colSpan={5} className="py-10 text-center text-darklink">Loading donors…</TableCell></TableRow>:visible.length?visible.map((r,i)=>{const l=latest(r);return <TableRow key={idOf(r)||i}><TableCell><div className="flex items-start gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon="solar:user-rounded-line-duotone" height={18}/></span><div><Link href={`/dashboard/donors/${idOf(r)}`} className="font-medium hover:text-primary">{String(r?.first_name||nameOf(r)||`Donor #${idOf(r)||"—"}`).trim().split(/\s+/)[0]}</Link><div className="text-xs text-darklink">{r?.email||r?.user_email||"—"}{r?.phone?` · ${r.phone}`:""}</div></div></div></TableCell><TableCell>{count(r)}</TableCell><TableCell>{money(total(r),r?.currency||"$ ")}</TableCell><TableCell>{l&&typeof l==="object"?`${money(l.amount,l.currency||r?.currency||"$ ")} · ${fmtDate(l.date||l.created_at)}`:l!=null?money(l,r?.currency||"$ "):"—"}</TableCell><TableCell>{fmtDate(created(r))}</TableCell></TableRow>}):<TableRow><TableCell colSpan={5} className="py-10 text-center text-darklink">No donors found for this period.</TableCell></TableRow>}</TableBody></Table></div><div className="mt-4 flex items-center justify-between"><p className="text-sm text-darklink">Page {page} of {pages} · 10 items per page</p><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button><Button size="sm" variant="outline" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</Button></div></div></CardBox>;
}
