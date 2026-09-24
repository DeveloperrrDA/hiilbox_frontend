"use client";
import { useRouter } from "next/navigation";
import { useEffect,useMemo,useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import ListPagination from "@/app/components/growfund/shared/ListPagination";
import {
  type DateRangeKey,
} from "@/lib/dashboard/dateRanges";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";
import { campaignImage } from "@/lib/dashboard/campaignMedia";
import { Icon } from "@iconify/react";
function value(r:any,...keys:string[]){for(const k of keys){if(r?.[k]!==undefined&&r?.[k]!==null)return r[k];}return undefined;}
function campaignId(r:any){return Number(r?.campaign?.id??value(r,"campaign_id")??0);}
function rawDate(r:any){return value(r,"created_at","date_created","date","created");}
function dateValue(r:any){const raw=rawDate(r),d=raw?new Date(raw):null;return d&&!Number.isNaN(d.getTime())?d.toLocaleDateString():"—";}
function donorType(r:any){return r?.donor_type??r?.user_type??(r?.user_id?"Registered":"Guest");}
function minor(v:any){
  const n=Number(v??0);
  return Number.isFinite(n)?n/100:0;
}

function paymentMethodOf(r:any){
  const raw=
    r?.transaction?.payment_method ??
    r?.transaction?.gateway ??
    r?.payment?.payment_method ??
    r?.payment?.method ??
    r?.payment_method ??
    r?.payment_engine ??
    r?.gateway ??
    "";

  if(typeof raw==="object" && raw!==null){
    return String(
      raw.id ??
      raw.slug ??
      raw.name ??
      raw.label ??
      raw.type ??
      ""
    ).toLowerCase();
  }

  return String(raw).toLowerCase();
}

function isOfflinePayment(r:any){
  const method=paymentMethodOf(r);

  return (
    method.includes("bank") ||
    method.includes("bacs") ||
    method.includes("offline") ||
    method.includes("bank_transfer") ||
    method.includes("bank-transfer")
  );
}

function gatewayFee(r:any){
  const explicit=
    r?.gateway_fee ??
    r?.payment_gateway_fee ??
    r?.processing_fee;

  const explicitFee=
    explicit!==undefined &&
    explicit!==null &&
    explicit!==""
      ? minor(explicit)
      : 0;

  // Offline / bank-transfer donations use a 1% processing fee.
  // Some API responses return gateway_fee: 0 for these payments,
  // so offline payments must be checked before accepting zero.
  if(isOfflinePayment(r)){
    if(explicitFee > 0){
      return explicitFee;
    }

    const gross=Number(
      r?.amount ??
      r?.donation_amount ??
      r?.total ??
      0
    );

    return Number.isFinite(gross)
      ? gross * 0.01
      : 0;
  }

  return explicitFee;
}
function netAmount(r:any){
  const direct=Number(value(r,"net_amount","amount_after_fees","net"));

  if(Number.isFinite(direct))return direct;

  const gross=Number(value(r,"amount","donation_amount","total")??0);

  return Math.max(
    0,
    gross - gatewayFee(r) - minor(r?.platform_fee)
  );
}
export default function FundraiserDonations(){
 const router=useRouter();const[campaigns,setCampaigns]=useState<any[]>([]),[rows,setRows]=useState<any[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");const [campaignFilter, setCampaignFilter] = useState("");
const [dateRange, setDateRange] = useState<DateRangeKey>("all");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [page, setPage] = useState(1);
 useEffect(()=>{(async()=>{try{const token=localStorage.getItem("access_token")||"";const res=await fetch("/api/dashboard/fundraiser-donations",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});const json=await res.json();if(!res.ok)throw new Error(json?.message||"Unable to load donations.");setCampaigns(Array.isArray(json?.campaigns)?json.campaigns:[]);setRows(Array.isArray(json?.data)?json.data:[]);}catch(e){setError(e instanceof Error?e.message:"Unable to load donations.");}finally{setLoading(false);}})();},[]);
 const names=useMemo(()=>new Map(campaigns.map(c=>[Number(c.id),c.title||`Campaign #${c.id}`])),[campaigns]);
 const filtered=useMemo(()=>rows.filter(r=>{if(campaignFilter&&String(campaignId(r))!==campaignFilter)return false;const raw=rawDate(r);if(!raw)return !startDate&&!endDate;const d=new Date(raw);if(Number.isNaN(d.getTime()))return false;if(startDate&&d<new Date(`${startDate}T00:00:00`))return false;if(endDate&&d>new Date(`${endDate}T23:59:59`))return false;return true;}),[rows,campaignFilter,startDate,endDate]);
useEffect(() => {
  setPage(1);
}, [campaignFilter, dateRange, startDate, endDate]);const pages=Math.max(1,Math.ceil(filtered.length/10));const visibleRows=filtered.slice((page-1)*10,page*10);
 return <CardBox className="w-full !max-w-none"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h5 className="card-title">Donations</h5><p className="mt-1 text-sm text-darklink">Donations received by your campaigns only.</p></div><div className="grid gap-2 sm:grid-cols-2">
  <select
    value={campaignFilter}
    onChange={(e) => setCampaignFilter(e.target.value)}
    className="rounded-md border border-ld bg-transparent px-3 py-2.5"
  >
    <option value="">All Campaigns</option>

    {campaigns.map((c) => (
      <option key={c.id} value={c.id}>
        {c.title || `Campaign #${c.id}`}
      </option>
    ))}
  </select>

  <DatePresetSelect
    value={dateRange}
    onChange={setDateRange}
    startDate={startDate}
    endDate={endDate}
    onStartDateChange={setStartDate}
    onEndDateChange={setEndDate}
  />
</div></div>{error&&<div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}<div className="mt-4 flex justify-end"><ColumnVisibilityControl tableClass="fundraiser-donations-table" columns={["Donation", "Campaign", "Donor", "Donor Type", "Amount", "Status", "Date", "Actions"]}/></div><div className="mt-5 overflow-x-auto"><Table className="fundraiser-donations-table"><TableHeader><TableRow><TableHead>Donation</TableHead><TableHead>Campaign</TableHead><TableHead>Donor</TableHead><TableHead>Donor Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{loading?<TableRow><TableCell colSpan={8} className="py-10 text-center text-darklink">Loading donations…</TableCell></TableRow>:visibleRows.length?visibleRows.map((r,i)=>{const status=String(value(r,"payment_status","status")??"unknown"),cid=campaignId(r),donor=r?.donor??r?.user??{},donorName=[donor?.first_name,donor?.last_name].filter(Boolean).join(" ")||value(r,"donor_name","name")||donor?.display_name||value(r,"email")||"Anonymous",donorFirst=String(donor?.first_name||value(r,"first_name")||donorName).trim().split(/\s+/)[0]||"Anonymous",did=value(r,"id","donation_id");return <TableRow key={String(did??i)} className="cursor-pointer" onClick={()=>did&&router.push(`/dashboard/donations/${did}`)}><TableCell className="font-medium">#{did??"—"}</TableCell><TableCell><div className="flex items-center gap-3">{campaignImage(r)?<img src={campaignImage(r)} alt="" className="h-10 w-10 rounded-md object-cover"/>:<span className="h-10 w-10 shrink-0 rounded-md bg-lightgray"/>}<span>{r?.campaign?.title??names.get(cid)??`Campaign #${cid||"—"}`}</span></div></TableCell><TableCell><div className="flex items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon="solar:user-rounded-line-duotone" height={18}/></span><span>{donorFirst}</span></div></TableCell><TableCell><Badge variant="lightPrimary">{donorType(r)}</Badge></TableCell><TableCell className="font-medium text-success">
  ${Number(value(r,"amount") ?? 0).toFixed(2)}
</TableCell><TableCell><Badge variant={["paid","completed","successful","success"].includes(status.toLowerCase())?"lightSuccess":"lightPrimary"}>{status}</Badge></TableCell><TableCell>{dateValue(r)}</TableCell><TableCell className="text-right"><button className="text-sm font-medium text-primary hover:underline" onClick={e=>{e.stopPropagation();did&&router.push(`/dashboard/donations/${did}`)}}>View donation</button></TableCell></TableRow>}):<TableRow><TableCell colSpan={8} className="py-10 text-center text-darklink">No donations found for this period.</TableCell></TableRow>}</TableBody></Table></div><ListPagination
  page={page}
  totalPages={pages}
  totalRecords={filtered.length}
  pageSize={10}
  onPageChange={setPage}
/></CardBox>;
}
