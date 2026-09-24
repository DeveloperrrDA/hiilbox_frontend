"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";

type Campaign = {
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
            return <TableRow key={c.id}><TableCell><div><Link href={`/campaign/${c.id}`} className="font-medium text-dark hover:text-primary">{c.title || `Campaign #${c.id}`}</Link><p className="mt-1 text-xs text-darklink">ID #{c.id}</p></div></TableCell>
              <TableCell><Badge variant={statusVariants[c.status || ""] || "lightPrimary"}>{c.status || "unknown"}</Badge></TableCell>
              <TableCell><div className="min-w-32"><p className="font-medium">${raised.toLocaleString()} <span className="font-normal text-darklink">/ ${goal.toLocaleString()}</span></p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lightgray"><div className="h-full rounded-full bg-primary" style={{width:`${goal > 0 ? Math.min(100, raised/goal*100) : 0}%`}}/></div></div></TableCell>
              <TableCell><div className="flex flex-wrap gap-1">{c.is_paused && <Badge variant="lightWarning">Paused</Badge>}{c.is_hidden && <Badge variant="lightError">Hidden</Badge>}{c.is_ended && <Badge variant="lightPrimary">Ended</Badge>}{!c.is_paused && !c.is_hidden && !c.is_ended && <span className="text-sm text-darklink">Normal</span>}</div></TableCell>
              <TableCell className="text-darklink">{c.end_date ? new Date(c.end_date).toLocaleDateString() : "—"}</TableCell>
              <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={busy}><Icon icon={busy ? "solar:refresh-circle-linear" : "solar:menu-dots-bold"} height={20}/></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild><Link href={`/campaign/${c.id}`}><Icon icon="solar:eye-line-duotone"/> View campaign</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/dashboard/campaigns/${c.id}/edit`}><Icon icon="solar:pen-2-line-duotone"/> Edit campaign</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/dashboard/campaigns/${c.id}/overview`}><Icon icon="solar:chart-2-line-duotone"/> Campaign overview</Link></DropdownMenuItem><DropdownMenuSeparator/>
                <DropdownMenuItem onClick={()=>action(c.id,"secondary-status",{status:c.is_paused?"resume":"pause"})}><Icon icon={c.is_paused?"solar:play-line-duotone":"solar:pause-line-duotone"}/> {c.is_paused?"Resume":"Pause"}</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>action(c.id,"secondary-status",{status:c.is_hidden?"visible":"hide"})}><Icon icon={c.is_hidden?"solar:eye-line-duotone":"solar:eye-closed-line-duotone"}/> {c.is_hidden?"Make visible":"Hide"}</DropdownMenuItem>
                {!c.is_ended && <DropdownMenuItem onClick={()=>action(c.id,"secondary-status",{status:"end"},"End this campaign? This changes its operational state.")}><Icon icon="solar:stop-circle-line-duotone"/> End campaign</DropdownMenuItem>}
                <DropdownMenuSeparator/>{c.status === "trashed" ? <>
                  <DropdownMenuItem onClick={()=>action(c.id,"restore",{})}><Icon icon="solar:restart-line-duotone"/> Restore campaign</DropdownMenuItem>
                  <DropdownMenuItem className="text-error focus:text-error" onClick={()=>permanentDelete(c.id)}><Icon icon="solar:trash-bin-minimalistic-line-duotone"/> Delete permanently</DropdownMenuItem>
                </> : <DropdownMenuItem className="text-error focus:text-error" onClick={()=>action(c.id,"delete",{},"Move this campaign to trash?")}><Icon icon="solar:trash-bin-trash-line-duotone"/> Move to trash</DropdownMenuItem>}
              </DropdownMenuContent></DropdownMenu></TableCell></TableRow>
          })}
        </TableBody></Table>
      </div>
    </CardBox>
  </div>;
}
