"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { adminApi, fmtDate, idOf, money, rowsFrom } from "./adminApi";

function statusOf(r: any) { return String(r?.status ?? r?.payment_status ?? "unknown").toLowerCase(); }
function isTrashedStatus(status: string) { return status === "trash" || status === "trashed"; }
function campaignName(r: any) { return r?.campaign?.title ?? r?.campaign_title ?? r?.campaign_name ?? (r?.campaign_id ? `Campaign #${r.campaign_id}` : "—"); }
function donorName(r: any) { return r?.donor?.name ?? r?.user?.name ?? r?.donor_name ?? r?.display_name ?? r?.name ?? r?.email ?? "Anonymous"; }
function donorType(r: any) { return r?.donor_type ?? r?.user_type ?? (r?.user_id ? "Registered" : "Guest"); }
function dateOf(r: any) { return r?.date ?? r?.created_at ?? r?.date_created ?? r?.created_date; }
function netAmount(r: any) { return Number(r?.net_amount ?? r?.net ?? r?.amount_after_fees ?? r?.amount ?? 0); }
function gatewayFee(r: any) { return Number(r?.gateway_fee ?? r?.payment_gateway_fee ?? r?.processing_fee ?? 0); }

export default function AdminDonationManager() {
  const [rows, setRows] = useState<any[]>([]), [loading, setLoading] = useState(true), [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState(""), [notice, setNotice] = useState(""), [status, setStatus] = useState("all"), [search, setSearch] = useState("");
  const [campaignId, setCampaignId] = useState(""), [startDate, setStartDate] = useState(""), [endDate, setEndDate] = useState(""), [selected, setSelected] = useState<number[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ campaign_id: "", email: "", amount: "", notes: "", status: "pending", payment_method: "", payment_status: "pending", is_anonymous: false });

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const q = new URLSearchParams({ page: "1", per_page: "100" });
      if (status !== "all") q.set("status", status);
      if (search.trim()) q.set("search", search.trim());
      if (campaignId) q.set("campaign_id", campaignId);
      if (startDate) q.set("start_date", startDate);
      if (endDate) q.set("end_date", endDate);
      setRows(rowsFrom(await adminApi(`donations?${q}`)));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load donations."); }
    finally { setLoading(false); }
  }, [status, search, campaignId, startDate, endDate]);
  useEffect(() => void load(), [load]);

  async function act(id: number, path: string, payload: any, msg: string) { setBusy(id); setError(""); setNotice(""); try { const d = await adminApi(path, { method: "POST", body: JSON.stringify(payload) }); setNotice(d?.message || msg); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Action failed."); } finally { setBusy(null); } }
  async function approve(r: any) { const id = idOf(r); if (confirm("Approve this donation?")) await act(id, `donation/${id}/update-status`, { action: "approve" }, "Donation approved."); }
  async function decline(r: any) { const id = idOf(r); if (confirm("Decline this donation?")) await act(id, `donation/${id}/update-status`, { action: "decline" }, "Donation declined."); }
  async function trash(r: any) { const id = idOf(r); if (confirm("Move this donation to trash?")) await act(id, `donation/${id}/delete`, { is_permanent: false }, "Donation moved to trash."); }
  async function restore(r: any) { const id = idOf(r); await act(id, "donations/bulk-action", { ids: [id], action: "restore" }, "Donation restored."); }
  async function permanent(r: any) { const id = idOf(r); if (confirm("Permanently delete this donation?")) await act(id, `donation/${id}/delete`, { is_permanent: true }, "Donation permanently deleted."); }
  async function createDonation(e: FormEvent) { e.preventDefault(); setError(""); try { const payload = { ...createForm, campaign_id: Number(createForm.campaign_id), amount: Number(createForm.amount) }; const d = await adminApi("donations/create", { method: "POST", body: JSON.stringify(payload) }); setNotice(d?.message || "Donation created successfully."); setCreateOpen(false); setCreateForm({ campaign_id: "", email: "", amount: "", notes: "", status: "pending", payment_method: "", payment_status: "pending", is_anonymous: false }); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to create donation."); } }
  async function emptyTrash() { if (!confirm("Permanently delete all trashed donations?")) return; try { const d = await adminApi("donations/empty-trash", { method: "POST", body: "{}" }); setNotice(d?.message || "Donation trash emptied."); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to empty trash."); } }
  async function bulk(action: string) { if (!selected.length) return; try { const d = await adminApi("donations/bulk-action", { method: "POST", body: JSON.stringify({ ids: selected, action }) }); setNotice(d?.message || "Donations updated."); setSelected([]); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Bulk action failed."); } }

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(idOf(r)));
  const toggleAll = () => setSelected(allSelected ? [] : rows.map(idOf).filter(Boolean));
  const toggle = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return <CardBox>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h5 className="card-title">Donations</h5><p className="mt-1 text-sm text-darklink">Manage donation records, statuses and trash.</p></div><div className="flex gap-2">{selected.length > 0 && <><Button variant="outline" onClick={() => bulk("restore")}><Icon icon="solar:restart-line-duotone" /> Restore selected</Button><Button variant="outline" onClick={() => bulk("trash")}>Trash selected</Button></>}<Button variant="outline" onClick={emptyTrash}><Icon icon="solar:trash-bin-trash-line-duotone" /> Empty trash</Button><Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogTrigger asChild><Button><Icon icon="solar:add-circle-line-duotone" /> New Donation</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>New Donation</DialogTitle></DialogHeader><form onSubmit={createDonation} className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Campaign ID<input required type="number" value={createForm.campaign_id} onChange={(e) => setCreateForm({ ...createForm, campaign_id: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label><label className="text-sm">Amount<input required min="0" step="0.01" type="number" value={createForm.amount} onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label><label className="text-sm">Donor email<input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label><label className="text-sm">Payment method<input value={createForm.payment_method} onChange={(e) => setCreateForm({ ...createForm, payment_method: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label><label className="text-sm">Status<select value={createForm.status} onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2"><option value="pending">Pending</option><option value="completed">Completed</option></select></label><label className="text-sm">Payment status<select value={createForm.payment_status} onChange={(e) => setCreateForm({ ...createForm, payment_status: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2"><option value="pending">Pending</option><option value="completed">Completed</option><option value="failed">Failed</option></select></label><label className="sm:col-span-2 text-sm">Notes<textarea value={createForm.notes} onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })} rows={3} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label><label className="sm:col-span-2 flex items-center gap-2 text-sm"><Checkbox checked={createForm.is_anonymous} onCheckedChange={(v) => setCreateForm({ ...createForm, is_anonymous: Boolean(v) })} /> Anonymous donation</label><div className="sm:col-span-2 flex justify-end"><Button type="submit">Create donation</Button></div></form></DialogContent></Dialog></div></div>
    <div className="mt-5 grid gap-3 lg:grid-cols-[180px_220px_1fr_160px_160px]">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5"><option value="all">All Statuses</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="declined">Declined</option><option value="trash">Trash</option></select>
      <input value={campaignId} onChange={(e) => setCampaignId(e.target.value)} placeholder="All Campaigns / Campaign ID" className="rounded-md border border-ld bg-transparent px-3 py-2.5" />
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="rounded-md border border-ld bg-transparent px-3 py-2.5" />
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5" />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border border-ld bg-transparent px-3 py-2.5" />
    </div>
    {notice && <div className="mt-4 rounded-md bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}{error && <div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
    <div className="mt-4 overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead><TableHead>ID</TableHead><TableHead>Amount</TableHead><TableHead>Campaign</TableHead><TableHead>Donor Name</TableHead><TableHead>Donor Type</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Net Amount</TableHead><TableHead>Gateway Fee</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {loading ? <TableRow><TableCell colSpan={11} className="py-10 text-center">Loading donations…</TableCell></TableRow> : rows.length === 0 ? <TableRow><TableCell colSpan={11} className="py-10 text-center text-darklink">No donations found.</TableCell></TableRow> : rows.map((r) => { const id = idOf(r), st = statusOf(r), currency = r?.currency_symbol || r?.currency || "$"; const pending = ["pending", "processing", "review"].includes(st); return <TableRow key={id}>
        <TableCell><Checkbox checked={selected.includes(id)} onCheckedChange={() => toggle(id)} /></TableCell><TableCell>#{id}</TableCell><TableCell className="font-medium text-success">{money(r.amount, currency)}</TableCell><TableCell className="max-w-80 truncate">{campaignName(r)}</TableCell><TableCell>{donorName(r)}</TableCell><TableCell><Badge variant="lightPrimary">{donorType(r)}</Badge></TableCell><TableCell>{fmtDate(dateOf(r))}</TableCell><TableCell>{pending ? <div className="flex gap-2"><Button size="sm" variant="outline" className="text-success" disabled={busy === id} onClick={() => approve(r)} title="Approve"><Icon icon="solar:check-circle-bold" /></Button><Button size="sm" variant="outline" className="text-error" disabled={busy === id} onClick={() => decline(r)} title="Decline"><Icon icon="solar:close-circle-bold" /></Button></div> : <Badge variant={st === "completed" || st === "approved" ? "lightSuccess" : st === "trashed" || st === "declined" || st === "failed" ? "lightError" : "lightWarning"}>{st}</Badge>}</TableCell><TableCell className="font-medium text-success">{money(netAmount(r), currency)}</TableCell><TableCell>{money(gatewayFee(r), currency)}</TableCell>
        <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={busy === id}><Icon icon="solar:menu-dots-bold" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => approve(r)}>Approve</DropdownMenuItem><DropdownMenuItem onClick={() => decline(r)}>Decline</DropdownMenuItem><DropdownMenuSeparator />{isTrashedStatus(st) ? <><DropdownMenuItem onClick={() => restore(r)}><Icon icon="solar:restart-line-duotone" /> Restore</DropdownMenuItem><DropdownMenuItem className="text-error" onClick={() => permanent(r)}>Delete permanently</DropdownMenuItem></> : <DropdownMenuItem className="text-error" onClick={() => trash(r)}>Move to trash</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></TableCell>
      </TableRow>; })}
    </TableBody></Table></div>
  </CardBox>;
}
