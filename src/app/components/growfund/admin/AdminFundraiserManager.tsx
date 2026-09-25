"use client";

import Link from "next/link";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { adminApi, dataFrom, fmtDate, idOf, nameOf, rowsFrom } from "./adminApi";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { isDateInRange, type DateRangeKey } from "@/lib/dashboard/dateRanges";

const blank = { first_name: "", last_name: "", email: "", username: "", password: "", phone: "", image: "" };

function statusOf(r: any) { return String(r?.status ?? r?.fundraiser_status ?? r?.approval_status ?? "pending").toLowerCase(); }
function isTrashedStatus(status: string) { return status === "trash" || status === "trashed"; }
function deepValue(input: any, keys: string[]): any {
  if (!input || typeof input !== "object") return undefined;
  for (const key of keys) if (input[key] !== undefined && input[key] !== null && input[key] !== "") return input[key];
  for (const value of Object.values(input)) if (value && typeof value === "object") { const found = deepValue(value, keys); if (found !== undefined) return found; }
  return undefined;
}
function createdCampaigns(r: any) {
  const value = r?.total_campaign_created ?? 
    r?.__campaign_count ?? 
    deepValue(r?.__overview, ["created_campaigns", "campaign_count", "campaigns_count", "total_campaigns", "campaigns"]) ?? 
    deepValue(r, ["created_campaigns", "campaign_count", "campaigns_count", "total_campaigns", "campaigns"]);
  
  return Number(Array.isArray(value) ? value.length : value ?? 0);
}
function joinedDate(r: any) {
  // Use only account-registration fields. Recursive date lookup can accidentally pick
  // campaign/donation activity dates from an overview response.
  const sources = [r, r?.user, r?.fundraiser, r?.data, r?.__overview?.fundraiser, r?.__overview?.user, r?.__overview];
  const keys = ["user_registered", "registered_at", "registration_date", "registered_date", "joined_at", "joined_date", "date_created", "created_at"];
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && String(value).trim()) return value;
    }
  }
  return undefined;
}

export default function AdminFundraiserManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRangeKey>("this_year");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(0);

  const load = useCallback(async () => {
    setLoading(true); 
    setError("");
    
    try {
      const makeQ = (fundraiserStatus?: string) => { 
        const q = new URLSearchParams({ page: "1", per_page: "100" }); 
        if (fundraiserStatus) q.set("status", fundraiserStatus); 
        if (search.trim()) q.set("search", search.trim()); 
        return q; 
      };
      
      const baseRows:any[] = rowsFrom(
        await adminApi(`fundraisers/paginated?${makeQ(status === "all" ? undefined : status)}`)
      );

      // Instantly set the rows. No background loops needed!
      setRows(baseRows);

    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load fundraisers.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => void load(), [load]);

  async function action(r: any, actionName: string, reason?: string) {
    const id = idOf(r); setBusy(id); setError("");
    try {
      const d = await adminApi(`fundraiser/${id}/update-status`, { method: "POST", body: JSON.stringify({ action: actionName, ...(reason ? { reason } : {}) }) });
      setNotice(d?.message || `Fundraiser ${actionName} action completed.`); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Fundraiser action failed."); }
    finally { setBusy(null); }
  }

  async function approve(r: any) { if (confirm("Approve this fundraiser?")) await action(r, "approve"); }
  async function decline(r: any) { const reason = prompt("Reason for declining this fundraiser:", ""); if (reason !== null) await action(r, "decline", reason); }

  async function create(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      const d = await adminApi("fundraiser/create", { method: "POST", body: JSON.stringify(form) });
      setNotice(d?.message || "Fundraiser created successfully."); setOpen(false); setForm(blank); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create fundraiser."); }
  }

  async function beginEdit(r: any) {
    const id = idOf(r); setBusy(id); setError("");
    try {
      let source = r;
      try { source = dataFrom(await adminApi(`fundraiser/${id}/overview`)); } catch { /* list data is enough */ }
      source = source?.fundraiser ?? source;
      setEditingId(id);
      setForm({
        first_name: source?.first_name ?? r?.first_name ?? "",
        last_name: source?.last_name ?? r?.last_name ?? "",
        email: source?.email ?? source?.user_email ?? r?.email ?? r?.user_email ?? "",
        username: source?.username ?? source?.user_login ?? r?.username ?? r?.user_login ?? "",
        password: "",
        phone: source?.phone ?? r?.phone ?? "",
        image: String(source?.image?.id ?? source?.image_id ?? source?.image ?? r?.image_id ?? ""),
      });
      setEditOpen(true);
    } finally { setBusy(null); }
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      const payload: any = { ...form }; if (!payload.password) delete payload.password; if (payload.image) payload.image = Number(payload.image); else delete payload.image;
      const d = await adminApi(`fundraiser/${editingId}/update`, { method: "POST", body: JSON.stringify(payload) });
      setNotice(d?.message || "Fundraiser updated successfully."); setEditOpen(false); setForm(blank); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update fundraiser."); }
  }

  async function remove(r: any, permanent = false) {
    const id = idOf(r); if (!confirm(permanent ? "Permanently delete this fundraiser?" : "Move this fundraiser to trash?")) return;
    setBusy(id); try {
      const d = await adminApi(`fundraiser/${id}/delete`, { method: "DELETE", body: JSON.stringify({ delete_type: permanent ? "permanent" : "trash" }) });
      setNotice(d?.message || (permanent ? "Fundraiser permanently deleted." : "Fundraiser moved to trash.")); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Delete failed."); } finally { setBusy(null); }
  }

  async function restore(r: any) {
    const id = idOf(r); setBusy(id);
    try {
      const d = await adminApi("fundraisers/bulk-action", { method: "POST", body: JSON.stringify({ ids: [id], action: "restore", is_permanent_delete: false }) });
      setNotice(d?.message || "Fundraiser restored."); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Restore failed."); } finally { setBusy(null); }
  }

  async function emptyTrash() {
    if (!confirm("Permanently delete all trashed fundraisers?")) return;
    try {
      const d = await adminApi("fundraisers/empty-trash", { method: "POST", body: JSON.stringify({ is_permanent_delete: true }) });
      setNotice(d?.message || "Fundraiser trash emptied."); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to empty trash."); }
  }


  const visibleRows = useMemo(() => rows.filter((r) => { const st=statusOf(r); const statusOk=status==="all" || st===status || (status==="approved"&&st==="active") || (status==="declined"&&st==="rejected"); const raw=joinedDate(r),d=raw?new Date(raw):null; if(startDate&&(!d||d<new Date(`${startDate}T00:00:00`)))return false; if(endDate&&(!d||d>new Date(`${endDate}T23:59:59`)))return false; return statusOk && (!raw || isDateInRange(raw, dateRange)); }), [rows, dateRange, status, startDate, endDate]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / 10));
  const totalFundraisers = visibleRows.length;
  const pageRows = visibleRows.slice((page - 1) * 10, page * 10);
  useEffect(() => setPage(1), [status, dateRange, startDate, endDate]);

  const formFields = [["first_name", "First name", true], ["last_name", "Last name", false], ["email", "Email", true], ["username", "Username", true], ["password", "Password", false], ["phone", "Phone", false], ["image", "Image / Avatar Media ID", false]] as const;
  const formMarkup = (submitLabel: string, submit: (e: FormEvent) => void) => <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{formFields.map(([k, l, req]) => <label key={k} className="text-sm">{l}<input required={req} type={k === "password" ? "password" : k === "email" ? "email" : "text"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label>)}<div className="sm:col-span-2 flex justify-end"><Button type="submit">{submitLabel}</Button></div></form>;

  return <CardBox className="w-full !max-w-none">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h5 className="card-title">Fundraisers</h5><p className="mt-1 text-sm text-darklink">Fundraiser details, created campaigns, approval status and joined date.</p></div><div className="flex gap-2"><Button variant="outline" onClick={emptyTrash}><Icon icon="solar:trash-bin-trash-line-duotone" /> Empty trash</Button><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Icon icon="solar:user-plus-rounded-line-duotone" /> Create Fundraiser</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create Fundraiser</DialogTitle></DialogHeader>{formMarkup("Create fundraiser", create)}</DialogContent></Dialog></div></div>
    <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_200px]"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fundraisers" className="rounded-md border border-ld bg-transparent px-3 py-2.5" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-ld bg-transparent px-3"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="declined">Declined</option><option value="trash">Trash</option></select><DatePresetSelect value={dateRange} onChange={setDateRange}/><input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} aria-label="Start Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5"/><input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} aria-label="End Date" className="rounded-md border border-ld bg-transparent px-3 py-2.5"/></div>
    {notice && <div className="mt-4 rounded-md bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}{error && <div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
    <div className="mt-4 flex justify-end"><ColumnVisibilityControl tableClass="admin-fundraisers-table" columns={["Fundraiser Details", "Created Campaigns", "Status", "Joined Date", "Actions"]}/></div><div className="mt-4 overflow-x-auto"><Table className="admin-fundraisers-table"><TableHeader><TableRow><TableHead>Fundraiser Details</TableHead><TableHead>Created Campaigns</TableHead><TableHead>Status</TableHead><TableHead>Joined Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {loading ? <TableRow><TableCell colSpan={5} className="py-10 text-center">Loading fundraisers…</TableCell></TableRow> : visibleRows.length === 0 ? <TableRow><TableCell colSpan={5} className="py-10 text-center text-darklink">No fundraisers found. If this account has fundraisers, verify the logged-in admin JWT is valid.</TableCell></TableRow> : pageRows.map((r) => { const id = idOf(r), st = statusOf(r); const pending = ["pending", "review", "submitted", "inactive"].includes(st); return <TableRow key={id}>
        <TableCell><Link href={`/dashboard/fundraisers/${id}`} className="font-medium hover:text-primary">{nameOf(r) || `Fundraiser #${id}`}</Link><div className="text-xs text-darklink">{r.email || r.user_email || "—"}{r.phone ? ` · ${r.phone}` : ""}</div></TableCell>
        <TableCell>{createdCampaigns(r)}</TableCell>
        <TableCell>{pending ? <div className="flex items-center gap-2"><Badge variant="lightWarning">{st}</Badge><Button size="sm" variant="outline" className="text-success" disabled={busy === id} onClick={() => approve(r)} title="Approve"><Icon icon="solar:check-circle-bold" /></Button><Button size="sm" variant="outline" className="text-error" disabled={busy === id} onClick={() => decline(r)} title="Decline"><Icon icon="solar:close-circle-bold" /></Button></div> : <Badge variant={st === "approved" || st === "active" ? "lightSuccess" : st === "declined" || isTrashedStatus(st) ? "lightError" : "lightPrimary"}>{st}</Badge>}</TableCell>
        <TableCell>{fmtDate(joinedDate(r))}</TableCell>
        <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={busy === id}><Icon icon="solar:menu-dots-bold" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52"><DropdownMenuItem onClick={() => beginEdit(r)}><Icon icon="solar:pen-2-line-duotone" /> Edit / Update</DropdownMenuItem><DropdownMenuItem onClick={() => approve(r)}><Icon icon="solar:check-circle-line-duotone" /> Approve</DropdownMenuItem><DropdownMenuItem onClick={() => decline(r)}><Icon icon="solar:close-circle-line-duotone" /> Decline</DropdownMenuItem><DropdownMenuSeparator />{isTrashedStatus(st) ? <><DropdownMenuItem onClick={() => restore(r)}><Icon icon="solar:restart-line-duotone" /> Restore</DropdownMenuItem><DropdownMenuItem className="text-error" onClick={() => remove(r, true)}>Delete permanently</DropdownMenuItem></> : <DropdownMenuItem className="text-error" onClick={() => remove(r, false)}>Move to trash</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></TableCell>
      </TableRow>; })}
    </TableBody></Table></div>
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-darklink">
        Page {page} of {totalPages} · 10 items per page | {totalFundraisers} Fundraisers
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
          let pages = [];
          if (totalPages <= 5) {
            // Show all if 5 or fewer pages
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
          } else {
            // Sliding window for more than 5 pages
            if (page <= 3) {
              pages = [1, 2, 3, 4, '...', totalPages];
            } else if (page >= totalPages - 2) {
              pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
              pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
            }
          }

          return pages.map((p, index) => {
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
          disabled={page >= totalPages} 
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
    <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit Fundraiser</DialogTitle></DialogHeader>{formMarkup("Save changes", saveEdit)}</DialogContent></Dialog>
  </CardBox>;
}
