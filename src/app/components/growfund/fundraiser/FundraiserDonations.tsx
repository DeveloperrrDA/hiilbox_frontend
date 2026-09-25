"use client";
import { useRouter } from "next/navigation";
import { useEffect,useMemo,useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";
import { campaignImage } from "@/lib/dashboard/campaignMedia";
import { Icon } from "@iconify/react";
function value(r:any,...keys:string[]){for(const k of keys){if(r?.[k]!==undefined&&r?.[k]!==null)return r[k];}return undefined;}
function campaignId(r:any){return Number(r?.campaign?.id??value(r,"campaign_id")??0);}
function rawDate(r:any){return value(r,"created_at","date_created","date","created");}
function dateValue(r:any){const raw=rawDate(r),d=raw?new Date(raw):null;return d&&!Number.isNaN(d.getTime())?d.toLocaleDateString():"—";}
function donorType(r:any){return r?.donor_type??r?.user_type??(r?.user_id?"Registered":"Guest");}
function minor(v:any){const n=Number(v??0);return Number.isFinite(n)?n/100:0;}
function netAmount(r:any){const direct=Number(value(r,"net_amount","amount_after_fees","net"));if(Number.isFinite(direct))return direct;const gross=Number(value(r,"amount","donation_amount","total")??0);return Math.max(0,gross-minor(r?.gateway_fee)-minor(r?.platform_fee));}
export default function FundraiserDonations(){
 const router=useRouter();const[campaigns,setCampaigns]=useState<any[]>([]),[rows,setRows]=useState<any[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");const[campaignFilter,setCampaignFilter]=useState(""),[startDate,setStartDate]=useState(""),[endDate,setEndDate]=useState(""),[page,setPage]=useState(1);
 useEffect(()=>{(async()=>{try{const token=localStorage.getItem("access_token")||"";const res=await fetch("/api/dashboard/fundraiser-donations",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});const json=await res.json();if(!res.ok)throw new Error(json?.message||"Unable to load donations.");setCampaigns(Array.isArray(json?.campaigns)?json.campaigns:[]);setRows(Array.isArray(json?.data)?json.data:[]);}catch(e){setError(e instanceof Error?e.message:"Unable to load donations.");}finally{setLoading(false);}})();},[]);
 const names=useMemo(()=>new Map(campaigns.map(c=>[Number(c.id),c.title||`Campaign #${c.id}`])),[campaigns]);
 const filtered=useMemo(()=>rows.filter(r=>{if(campaignFilter&&String(campaignId(r))!==campaignFilter)return false;const raw=rawDate(r);if(!raw)return !startDate&&!endDate;const d=new Date(raw);if(Number.isNaN(d.getTime()))return false;if(startDate&&d<new Date(`${startDate}T00:00:00`))return false;if(endDate&&d>new Date(`${endDate}T23:59:59`))return false;return true;}),[rows,campaignFilter,startDate,endDate]);
 useEffect(()=>setPage(1),[campaignFilter,startDate,endDate]);
 const pages=Math.max(1,Math.ceil(filtered.length/10));
 const totalDonations=filtered.length;
 const visibleRows=filtered.slice((page-1)*10,page*10);
 return <CardBox className="w-full !max-w-none"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h5 className="card-title">Donations</h5><p className="mt-1 text-sm text-darklink">Donations received by your campaigns only.</p></div><div className="grid gap-2 sm:grid-cols-3"><select value={campaignFilter} onChange={e=>setCampaignFilter(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5"><option value="">All Campaigns</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.title||`Campaign #${c.id}`}</option>)}</select><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} aria-label="Start Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5"/><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} aria-label="End Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5"/></div></div>{error&&<div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}<div className="mt-4 flex justify-end"><ColumnVisibilityControl tableClass="fundraiser-donations-table" columns={["Donation", "Campaign", "Donor", "Donor Type", "Amount", "Status", "Date", "Actions"]}/></div><div className="mt-5 overflow-x-auto"><Table className="fundraiser-donations-table"><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Campaign</TableHead><TableHead>Donor</TableHead><TableHead>Donor Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{loading?<TableRow><TableCell colSpan={8} className="py-10 text-center text-darklink">Loading donations…</TableCell></TableRow>:visibleRows.length?visibleRows.map((r,i)=>{const status=String(value(r,"payment_status","status")??"unknown"),cid=campaignId(r),donor=r?.donor??r?.user??{},donorName=[donor?.first_name,donor?.last_name].filter(Boolean).join(" ")||value(r,"donor_name","name")||donor?.display_name||value(r,"email")||"Anonymous",donorFirst=String(donor?.first_name||value(r,"first_name")||donorName).trim().split(/\s+/)[0]||"Anonymous",did=value(r,"id","donation_id");return <TableRow key={String(did??i)} className="cursor-pointer" onClick={()=>did&&router.push(`/dashboard/donations/${did}`)}><TableCell className="font-medium">#{did??"—"}</TableCell><TableCell><div className="flex items-center gap-3">{campaignImage(r)?<img src={campaignImage(r)} alt="" className="h-10 w-10 rounded-md object-cover"/>:<span className="h-10 w-10 shrink-0 rounded-md bg-lightgray"/>}<span>{r?.campaign?.title??names.get(cid)??`Campaign #${cid||"—"}`}</span></div></TableCell><TableCell><div className="flex items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon="solar:user-rounded-line-duotone" height={18}/></span><span>{donorFirst}</span></div></TableCell><TableCell><Badge variant="lightPrimary">{donorType(r)}</Badge></TableCell><TableCell className="font-medium text-success">${netAmount(r).toFixed(2)}</TableCell><TableCell><Badge variant={["paid","completed","successful","success"].includes(status.toLowerCase())?"lightSuccess":"lightPrimary"}>{status}</Badge></TableCell><TableCell>{dateValue(r)}</TableCell><TableCell className="text-right"><button className="text-sm font-medium text-primary hover:underline" onClick={e=>{e.stopPropagation();did&&router.push(`/dashboard/donations/${did}`)}}>View donation</button></TableCell></TableRow>}):<TableRow><TableCell colSpan={8} className="py-10 text-center text-darklink">No donations found for this period.</TableCell></TableRow>}</TableBody></Table></div>
    <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-darklink">
            Page {page} of {pages} · 10 items per page | {totalDonations} Donations
        </p>
        <div className="flex gap-2">
            <Button 
            size="sm" 
            variant="outline" 
            disabled={page <= 1} 
            onClick={() => setPage((p) => p - 1)}
            >
            Previous
            </Button>

            {/* DYNAMIC NUMBERED PAGES WITH ELLIPSIS */}
            {(() => {
            let totalpages = [];
            if (pages <= 5) {
                totalpages = Array.from({ length: pages }, (_, i) => i + 1);
            } else {
                if (page <= 3) {
                totalpages = [1, 2, 3, 4, '...', pages];
                } else if (page >= pages - 2) {
                totalpages = [1, '...', pages - 3, pages - 2, pages - 1, pages];
                } else {
                totalpages = [1, '...', page - 1, page, page + 1, '...', pages];
                }
            }

            return totalpages.map((p, index) => {
                if (p === '...') {
                return (
                    <span 
                    key={`ellipsis-${index}`} 
                    className="flex items-center justify-center px-2 text-sm text-gray-500"
                    >
                    ...
                    </span>
                );
                }
                return (
                <Button
                    key={p}
                    size="sm"
                    variant={page === p ? "default" : "outline"} 
                    onClick={() => setPage(p as number)}
                >
                    {p}
                </Button>
                );
            });
            })()}

            <Button 
            size="sm" 
            variant="outline" 
            disabled={page >= pages} 
            onClick={() => setPage((p) => p + 1)}
            >
            Next
            </Button>
        </div>
    </div>
 </CardBox>;
}
