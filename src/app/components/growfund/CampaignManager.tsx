"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
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
  const [updateCampaign, setUpdateCampaign] = useState<Campaign | null>(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateImages, setUpdateImages] = useState<any[]>([]);
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

    <CardBox>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div><h5 className="card-title">Campaigns</h5><p className="mt-1 text-sm text-darklink">Manage campaigns raised from your fundraiser account.</p></div>
        <Button asChild><Link href="/create-campaign"><Icon icon="solar:add-circle-line-duotone" height={20}/> Create campaign</Link></Button>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-darklink" height={20}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your campaigns" className="w-full rounded-md border border-ld bg-transparent py-2.5 pl-10 pr-3 outline-none focus:border-primary"/></div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5 outline-none focus:border-primary">
          <option value="all">All statuses</option><option value="published">Published</option><option value="pending">Pending</option><option value="draft">Draft</option><option value="funded">Funded</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="declined">Declined</option><option value="trashed">Trash</option>
        </select>
      </div>

      {notice && <div className="mt-5 rounded-md border border-success/30 bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}
      {error && <div className="mt-5 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
      <div className="mt-4 overflow-x-auto">
        <Table><TableHeader><TableRow><TableHead>Campaign</TableHead><TableHead>Status</TableHead><TableHead>Raised / Goal</TableHead><TableHead>State</TableHead><TableHead>Ends</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={6} className="py-10 text-center text-darklink">Loading campaigns…</TableCell></TableRow> : campaigns.length === 0 ? <TableRow><TableCell colSpan={6} className="py-10 text-center text-darklink">No campaigns found for this account.</TableCell></TableRow> : campaigns.map(c => {
            const raised = Number(c.raised_amount ?? c.fund_raised ?? 0); const goal = Number(c.goal_amount ?? c.goal ?? 0); const busy = workingId === c.id;
            const image = campaignImage(c); return <TableRow key={c.id}><TableCell><Link href={`/dashboard/campaigns/${c.id}/edit`} className="flex items-center gap-3 font-medium text-dark hover:text-primary">{image ? <img src={String(image)} alt="" className="h-11 w-11 rounded-md object-cover"/> : <span className="h-11 w-11 rounded-md bg-lightgray"/>}<span><span className="block">{c.title || `Campaign #${c.id}`}</span><span className="mt-1 block text-xs font-normal text-darklink">ID #{c.id}</span></span></Link></TableCell>
              <TableCell><Badge variant={statusVariants[c.status || ""] || "lightPrimary"}>{c.status || "unknown"}</Badge></TableCell>
              <TableCell><div className="min-w-32"><p className="font-medium">${raised.toLocaleString()} <span className="font-normal text-darklink">/ ${goal.toLocaleString()}</span></p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lightgray"><div className="h-full rounded-full bg-primary" style={{width:`${goal > 0 ? Math.min(100, raised/goal*100) : 0}%`}}/></div></div></TableCell>
              <TableCell><div className="flex flex-wrap gap-1">{c.is_paused && <Badge variant="lightWarning">Paused</Badge>}{c.is_hidden && <Badge variant="lightError">Hidden</Badge>}{c.is_ended && <Badge variant="lightPrimary">Ended</Badge>}{!c.is_paused && !c.is_hidden && !c.is_ended && <span className="text-sm text-darklink">Normal</span>}</div></TableCell>
              <TableCell className="text-darklink">{c.end_date ? new Date(c.end_date).toLocaleDateString() : "—"}</TableCell>
              <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={busy}><Icon icon={busy ? "solar:refresh-circle-linear" : "solar:menu-dots-bold"} height={20}/></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={()=>openPostUpdate(c)}><Icon icon="solar:document-add-line-duotone"/> Post an update</DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/dashboard/campaigns/${c.id}/overview`}><Icon icon="solar:chart-2-line-duotone"/> Overview</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/campaign/${c.id}`}><Icon icon="solar:eye-line-duotone"/> Preview</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={()=>setNotice("Make a copy is coming soon.")}><Icon icon="solar:copy-line-duotone"/> Make a copy</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="text-error focus:text-error" disabled={c.status === "trashed"} onClick={()=>action(c.id,"delete",{},"Move this campaign to trash?")}><Icon icon="solar:trash-bin-trash-line-duotone"/> Move to trash</DropdownMenuItem>
              </DropdownMenuContent></DropdownMenu></TableCell></TableRow>
          })}
        </TableBody></Table>
      </div>
    </CardBox>
    <Dialog open={Boolean(updateCampaign)} onOpenChange={v=>!v&&setUpdateCampaign(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Post an update</DialogTitle></DialogHeader><div className="space-y-4"><label className="block text-sm">Title<input value={updateTitle} onChange={e=>setUpdateTitle(e.target.value)} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2.5" /></label><label className="block text-sm">Update<textarea value={updateDescription} onChange={e=>setUpdateDescription(e.target.value)} rows={6} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2.5" /></label><label className="block text-sm">Image<input type="file" accept="image/*" onChange={e=>void uploadUpdateImage(e.target.files)} className="mt-1 block w-full text-sm" /></label>{updateImages.length>0&&<p className="text-xs text-success">{updateImages.length} image(s) uploaded.</p>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setUpdateCampaign(null)}>Cancel</Button><Button onClick={()=>void submitPostUpdate()} disabled={postingUpdate||uploadingImage}>{postingUpdate?"Posting…":uploadingImage?"Uploading…":"Post update"}</Button></div></div></DialogContent></Dialog>
  </div>;
}
