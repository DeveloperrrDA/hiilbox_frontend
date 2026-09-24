"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { campaignImage } from "@/lib/dashboard/campaignMedia";

type Campaign = {
  [key: string]: any;
  id: number;
  title: string;
  status?: string;
  raised_amount?: number;
  fund_raised?: number;
  goal_amount?: number;
  goal?: number;
  number_of_contributors?: number;
  is_paused?: boolean;
  is_hidden?: boolean;
  is_ended?: boolean;
  end_date?: string | null;
};

const statusVariants: Record<string, any> = {
  published: "lightSuccess", pending: "lightWarning", draft: "lightPrimary", funded: "lightSuccess",
  declined: "lightError", trashed: "lightError", completed: "lightSuccess", cancelled: "lightError",
};

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [updateCampaign, setUpdateCampaign] = useState<Campaign | null>(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateImages, setUpdateImages] = useState<any[]>([]);
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [paidCounts, setPaidCounts] = useState<Record<number, number>>({});
  const [updatesCampaign, setUpdatesCampaign] = useState<Campaign | null>(null);
  const [campaignUpdates, setCampaignUpdates] = useState<any[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);

  const token = () => typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";

  const load = useCallback(async () => {
    const accessToken = token();
    if (!accessToken) { setError("Please sign in to manage your campaigns."); setLoading(false); return; }
    setLoading(true); setError("");
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (search.trim()) params.set("search", search.trim());
    try {
      const response = await fetch(`/api/dashboard/campaigns?${params}`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to load campaigns.");
      setCampaigns(Array.isArray(data?.data) ? data.data : []);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load campaigns."); }
    finally { setLoading(false); }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  async function action(id: number, path: string, payload: object, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    const accessToken = token();
    if (!accessToken) return;
    setWorkingId(id); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/dashboard/campaigns/${id}/${path}`, {
        method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Campaign action failed.");
      setNotice(data?.message || "Campaign updated successfully.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Campaign action failed."); }
    finally { setWorkingId(null); }
  }

  function openPostUpdate(c: Campaign) { setUpdateCampaign(c); setUpdateTitle(""); setUpdateDescription(""); setUpdateImages([]); setError(""); }
  async function uploadUpdateImage(files: FileList | null) {
    if (!files?.length) return; const accessToken=token(); if(!accessToken)return;
    setUploadingImage(true); setError("");
    try { const form=new FormData(); Array.from(files).forEach(file=>form.append("images[]",file)); const res=await fetch("/api/campaigns/media",{method:"POST",headers:{Authorization:`Bearer ${accessToken}`},body:form}); const json=await res.json().catch(()=>null); if(!res.ok)throw new Error(json?.message||"Image upload failed."); const uploaded=Array.isArray(json?.images)?json.images:Array.isArray(json?.data?.images)?json.data.images:[]; setUpdateImages(current=>[...current,...uploaded]); } catch(e){setError(e instanceof Error?e.message:"Image upload failed.")} finally{setUploadingImage(false)}
  }
  async function submitPostUpdate(){
    if(!updateCampaign)return; const title=updateTitle.trim(),description=updateDescription.trim(); if(!title||!description){setError("Title and description are required.");return} const accessToken=token(); if(!accessToken)return;
    setPostingUpdate(true);setError("");setNotice("");
    try{const slug=title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");const res=await fetch("/api/admin/growfund/campaign/update/create",{method:"POST",headers:{Authorization:`Bearer ${accessToken}`,"Content-Type":"application/json"},body:JSON.stringify({campaign_id:updateCampaign.id,title,slug,description,image:updateImages})});const json=await res.json().catch(()=>null);if(!res.ok)throw new Error(json?.message||"Unable to post campaign update.");setNotice(json?.message||"Campaign update posted successfully.");setUpdateCampaign(null);setUpdateImages([])}catch(e){setError(e instanceof Error?e.message:"Unable to post campaign update.")}finally{setPostingUpdate(false)}
  }

  async function openUpdates(c: Campaign) {
    setUpdatesCampaign(c); setCampaignUpdates([]); setUpdatesLoading(true); setError("");
    try {
      const qs=new URLSearchParams({page:"1",per_page:"100",campaign_id:String(c.id)});
      const res=await fetch(`/api/campaigns/updates?${qs.toString()}`,{cache:"no-store"});
      const json=await res.json().catch(()=>null);
      if(!res.ok)throw new Error(json?.message||"Unable to load campaign updates.");
      const list=Array.isArray(json?.data?.results)?json.data.results:Array.isArray(json?.paginated?.results)?json.paginated.results:Array.isArray(json?.data)?json.data:Array.isArray(json?.results)?json.results:[];
      setCampaignUpdates(list);
    } catch(e){setError(e instanceof Error?e.message:"Unable to load campaign updates.");}
    finally{setUpdatesLoading(false);}
  }

  async function bulkCampaign(ids:number[], actionName:string, confirmText?:string){
    if(!ids.length)return;
    if(confirmText&&!window.confirm(confirmText))return;
    const accessToken=token();if(!accessToken)return;
    setError("");setNotice("");
    try{
      const res=await fetch("/api/dashboard/campaigns/bulk-action",{method:"POST",headers:{Authorization:`Bearer ${accessToken}`,"Content-Type":"application/json"},body:JSON.stringify({ids,action:actionName})});
      const json=await res.json().catch(()=>null);if(!res.ok)throw new Error(json?.message||"Campaign action failed.");
      setNotice(json?.message||"Campaigns updated successfully.");await load();
    }catch(e){setError(e instanceof Error?e.message:"Campaign action failed.");}
  }

  async function emptyTrash(){
    const accessToken=token();if(!accessToken)return;
    if(!window.confirm("Permanently delete all of your trashed campaigns? This cannot be undone."))return;
    setError("");setNotice("");
    try{
      const res=await fetch("/api/dashboard/campaigns?status=trash",{headers:{Authorization:`Bearer ${accessToken}`},cache:"no-store"});
      const json=await res.json().catch(()=>null);if(!res.ok)throw new Error(json?.message||"Unable to load trash.");
      const trashed=(Array.isArray(json?.data)?json.data:[]).filter((c:any)=>["trash","trashed"].includes(String(c?.status??"").toLowerCase()));
      const ids=trashed.map((c:any)=>Number(c?.id)).filter(Boolean);
      if(!ids.length){setNotice("Trash is already empty.");return;}
      await bulkCampaign(ids,"delete");
    }catch(e){setError(e instanceof Error?e.message:"Unable to empty trash.");}
  }


  async function duplicateCampaign(c: Campaign) {
    const accessToken = token();
    if (!accessToken) return;
    setWorkingId(c.id); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/growfund/campaign/${c.id}/duplicate`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: "{}" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to duplicate campaign.");
      setNotice(data?.message || "Campaign duplicated successfully.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to duplicate campaign."); }
    finally { setWorkingId(null); }
  }

  async function permanentDelete(id: number) {
    if (!window.confirm("Permanently delete this campaign? This cannot be undone.")) return;
    const accessToken = token();
    if (!accessToken) return;
    setWorkingId(id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/dashboard/campaigns/bulk-action", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], action: "delete" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to permanently delete campaign.");
      setNotice(data?.message || "Campaign permanently deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to permanently delete campaign.");
    } finally {
      setWorkingId(null);
    }
  }


  const filteredCampaigns = useMemo(() => campaigns.filter((c) => {
    const raw = c?.created_at ?? c?.date_created ?? c?.start_date ?? c?.created;
    if (!raw) return !startDate && !endDate;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return false;
    if (startDate && d < new Date(`${startDate}T00:00:00`)) return false;
    if (endDate && d > new Date(`${endDate}T23:59:59`)) return false;
    return true;
  }), [campaigns, startDate, endDate]);
  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / 10));
  const visibleCampaigns = filteredCampaigns.slice((page - 1) * 10, page * 10);
  useEffect(() => {
    const accessToken = token();
    if (!accessToken || !visibleCampaigns.length) return;
    let cancelled = false;
    void Promise.all(visibleCampaigns.map(async (c) => {
      try {
        const response = await fetch(`/api/dashboard/growfund/donations/paginated?page=1&per_page=100&campaign_id=${c.id}&orderby=id&order=desc`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
        const json = await response.json().catch(() => null);
        const donationRows = Array.isArray(json?.data) ? json.data : Array.isArray(json?.data?.data) ? json.data.data : [];
        const count = donationRows.filter((d:any) => { const payment=String(d?.payment_status??"").toLowerCase(); const status=String(d?.status??"").toLowerCase(); return payment ? payment==="paid" : ["paid","completed","complete","successful","success"].includes(status); }).length;
        return [c.id, count] as const;
      } catch { return [c.id, 0] as const; }
    })).then(entries => { if (!cancelled) setPaidCounts(current => ({...current, ...Object.fromEntries(entries)})); });
    return () => { cancelled = true; };
  }, [page, campaigns]);

  useEffect(() => setPage(1), [filter, search, startDate, endDate]);

  const totals = useMemo(() => ({
    all: campaigns.length,
    raised: campaigns.reduce((sum, c) => sum + Number(c.raised_amount ?? c.fund_raised ?? 0), 0),
    active: campaigns.filter(c => c.status === "published" && !c.is_paused && !c.is_ended).length,
    contributors: campaigns.reduce((sum, c) => sum + Number(c.number_of_contributors ?? 0), 0),
  }), [campaigns]);

  return <div className="space-y-7">
    <div className="grid grid-cols-12 gap-6">
      {[
        ["My campaigns", totals.all, "solar:flag-2-line-duotone"],
        ["Active", totals.active, "solar:play-circle-line-duotone"],
        ["Raised", `$${totals.raised.toLocaleString()}`, "solar:wallet-money-line-duotone"],
        ["Contributors", totals.contributors, "solar:users-group-rounded-line-duotone"],
      ].map(([label, value, icon]) => <CardBox key={String(label)} className="col-span-12 sm:col-span-6 xl:col-span-3">
        <div className="flex items-center justify-between"><div><p className="text-sm text-darklink">{label}</p><h4 className="mt-2 text-2xl font-semibold">{value}</h4></div><span className="flex h-12 w-12 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon={String(icon)} height={25}/></span></div>
      </CardBox>)}
    </div>

    <CardBox className="w-full !max-w-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div><h5 className="card-title">Campaigns</h5><p className="mt-1 text-sm text-darklink">Manage campaigns raised from your fundraiser account.</p></div>
        <div className="flex flex-wrap gap-2">{filter==="trash"&&<Button variant="outline" onClick={()=>void emptyTrash()}><Icon icon="solar:trash-bin-trash-line-duotone"/> Empty trash</Button>}<Button asChild><Link href="/create-campaign"><Icon icon="solar:add-circle-line-duotone" height={20}/> Create campaign</Link></Button></div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative flex-1"><Icon icon="solar:magnifer-linear" className="absolute left-3 top-5 -translate-y-1/2 text-darklink" height={20}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your campaigns" className="w-full rounded-md border border-ld bg-transparent py-2.5 pl-10 pr-3 outline-none focus:border-primary"/>{search.trim()&&campaigns.length>0&&<div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-md border border-ld bg-white p-1 shadow-lg dark:bg-darkgray">{campaigns.slice(0,8).map(c=>{const image=campaignImage(c);return <Link key={c.id} href={`/dashboard/campaigns/${c.id}/edit`} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-lightgray">{image?<img src={String(image)} alt="" className="h-9 w-9 rounded-md object-cover"/>:<span className="h-9 w-9 rounded-md bg-lightgray"/>}<span className="min-w-0"><span className="block truncate font-medium">{c.title||`Campaign #${c.id}`}</span><span className="text-xs text-darklink">Campaign #{c.id}</span></span></Link>})}</div>}</div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5 outline-none focus:border-primary">
          <option value="all">All statuses</option><option value="published">Published</option><option value="pending">Pending</option><option value="draft">Draft</option><option value="funded">Funded</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="declined">Declined</option><option value="trash">Trash</option>
        </select>
        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} aria-label="Start Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5 outline-none focus:border-primary"/>
        <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} aria-label="End Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5 outline-none focus:border-primary"/>
      </div>

      {notice && <div className="mt-5 rounded-md border border-success/30 bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}
      {error && <div className="mt-5 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
      <div className="mt-4 flex justify-end">
        <ColumnVisibilityControl
  tableClass="campaign-list-table"
  columns={[
    "Campaign ID",
    "Campaign",
    "Status",
    "Raised / Goal",
    "State",
    "Ends",
    "Actions",
  ]}
/>
        </div><div className="mt-4 overflow-x-auto">
        <Table className="campaign-list-table">
          <TableHeader>
  <TableRow>
    <TableHead>Campaign ID</TableHead>
    <TableHead>Campaign</TableHead>
    <TableHead>Status</TableHead>
    <TableHead>Raised / Goal</TableHead>
    <TableHead>State</TableHead>
    <TableHead>Ends</TableHead>
    <TableHead className="text-right">Actions</TableHead>
  </TableRow>
</TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={9} className="py-10 text-center text-darklink">Loading campaigns…</TableCell></TableRow> : visibleCampaigns.length === 0 ? <TableRow><TableCell colSpan={9} className="py-10 text-center text-darklink">No campaigns found for this account.</TableCell></TableRow> : visibleCampaigns.map(c => {
            const raised = Number(c.raised_amount ?? c.fund_raised ?? 0); const goal = Number(c.goal_amount ?? c.goal ?? 0); const busy = workingId === c.id;
            const image = campaignImage(c); return <TableRow key={c.id}><TableCell className="font-medium">#{c.id}</TableCell><TableCell><Link href={`/dashboard/campaigns/${c.id}/edit`} className="flex items-center gap-3 font-medium text-dark hover:text-primary">{image ? <img src={String(image)} alt="" className="h-11 w-11 rounded-md object-cover"/> : <span className="h-11 w-11 rounded-md bg-lightgray"/>}<span className="block">{c.title || `Campaign #${c.id}`}</span></Link></TableCell>
              <TableCell>{c?.author?.display_name ?? c?.fundraiser?.display_name ?? c?.creator?.display_name ?? c?.author?.name ?? c?.fundraiser?.name ?? c?.creator?.name ?? c?.author_name ?? c?.fundraiser_name ?? "—"}</TableCell>
              <TableCell><Badge variant={statusVariants[c.status || ""] || "lightPrimary"}>{c.status || "unknown"}</Badge></TableCell>
              <TableCell><div className="min-w-32"><p className="font-medium">${raised.toLocaleString()} <span className="font-normal text-darklink">/ ${goal.toLocaleString()}</span></p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lightgray"><div className="h-full rounded-full bg-primary" style={{width:`${goal > 0 ? Math.min(100, raised/goal*100) : 0}%`}}/></div></div></TableCell>
              <TableCell>{paidCounts[c.id] ?? "…"}</TableCell>
              <TableCell><div className="flex flex-wrap gap-1">{c.is_paused && <Badge variant="lightWarning">Paused</Badge>}{c.is_hidden && <Badge variant="lightError">Hidden</Badge>}{c.is_ended && <Badge variant="lightPrimary">Ended</Badge>}{!c.is_paused && !c.is_hidden && !c.is_ended && <span className="text-sm text-darklink">Normal</span>}</div></TableCell>
              <TableCell className="text-darklink">{c.end_date ? new Date(c.end_date).toLocaleDateString() : "—"}</TableCell>
              <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={busy}><Icon icon={busy ? "solar:refresh-circle-linear" : "solar:menu-dots-bold"} height={20}/></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={()=>void openUpdates(c)}><Icon icon="solar:document-text-line-duotone"/> Campaign updates</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>openPostUpdate(c)}><Icon icon="solar:document-add-line-duotone"/> Post an update</DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/dashboard/campaigns/${c.id}/overview`}><Icon icon="solar:chart-2-line-duotone"/> Overview</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/campaign/${c.id}`}><Icon icon="solar:eye-line-duotone"/> Preview</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={()=>void duplicateCampaign(c)}><Icon icon="solar:copy-line-duotone"/> Make a copy</DropdownMenuItem>
                <DropdownMenuSeparator/>
                {["trash","trashed"].includes(String(c.status).toLowerCase()) ? <><DropdownMenuItem onClick={()=>void bulkCampaign([c.id],"restore")}><Icon icon="solar:restart-line-duotone"/> Restore</DropdownMenuItem><DropdownMenuItem className="text-error focus:text-error" onClick={()=>void bulkCampaign([c.id],"delete","Permanently delete this campaign? This cannot be undone.")}><Icon icon="solar:trash-bin-trash-line-duotone"/> Delete permanently</DropdownMenuItem></> : <DropdownMenuItem className="text-error focus:text-error" onClick={()=>action(c.id,"delete",{},"Move this campaign to trash?")}><Icon icon="solar:trash-bin-trash-line-duotone"/> Move to trash</DropdownMenuItem>}
              </DropdownMenuContent></DropdownMenu></TableCell></TableRow>
          })}
        </TableBody></Table>
      </div>
      <div className="mt-4 flex items-center justify-between"><p className="text-sm text-darklink">Page {page} of {totalPages} · 10 items per page</p><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button><Button size="sm" variant="outline" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button></div></div>
    </CardBox>
    <Dialog open={Boolean(updatesCampaign)} onOpenChange={v=>!v&&setUpdatesCampaign(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Campaign updates</DialogTitle></DialogHeader>{updatesCampaign&&<div className="flex items-center justify-between rounded-md border border-ld p-3"><div><div className="font-medium">{updatesCampaign.title||`Campaign #${updatesCampaign.id}`}</div><div className="text-xs text-darklink">Updates linked to campaign #{updatesCampaign.id}</div></div><Button size="sm" onClick={()=>{const c=updatesCampaign;setUpdatesCampaign(null);openPostUpdate(c)}}><Icon icon="solar:add-circle-line-duotone"/> Post an update</Button></div>}<div className="max-h-[55vh] overflow-auto">{updatesLoading?<div className="py-10 text-center text-darklink">Loading updates…</div>:campaignUpdates.length===0?<div className="py-10 text-center text-darklink">No updates have been posted for this campaign.</div>:<div className="divide-y divide-border">{campaignUpdates.map((u:any,i:number)=><div key={String(u?.id??u?.post_id??i)} className="py-4"><div className="font-medium">{u?.title||u?.post_title||`Update #${u?.id??i+1}`}</div><div className="mt-1 whitespace-pre-wrap text-sm text-darklink">{u?.description||u?.content||u?.post_content||""}</div></div>)}</div>}</div></DialogContent></Dialog>
    <Dialog open={Boolean(updateCampaign)} onOpenChange={v=>!v&&setUpdateCampaign(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Post an update</DialogTitle></DialogHeader><div className="space-y-4"><label className="block text-sm">Title<input value={updateTitle} onChange={e=>setUpdateTitle(e.target.value)} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2.5" /></label><label className="block text-sm">Update<textarea value={updateDescription} onChange={e=>setUpdateDescription(e.target.value)} rows={6} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2.5" /></label><label className="block text-sm">Image<input type="file" accept="image/*" onChange={e=>void uploadUpdateImage(e.target.files)} className="mt-1 block w-full text-sm" /></label>{updateImages.length>0&&<p className="text-xs text-success">{updateImages.length} image(s) uploaded.</p>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setUpdateCampaign(null)}>Cancel</Button><Button onClick={()=>void submitPostUpdate()} disabled={postingUpdate||uploadingImage}>{postingUpdate?"Posting…":uploadingImage?"Uploading…":"Post update"}</Button></div></div></DialogContent></Dialog>
  </div>;
}
