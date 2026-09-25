"use client";

import Link from "next/link";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import ListPagination from "@/app/components/growfund/shared/ListPagination";
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
function statusMatches(r: any, wanted: string) {
  const actual = statusOf(r);

  if (wanted === "all") return true;

  const groups: Record<string, string[]> = {
    pending: ["pending", "review", "submitted", "inactive"],
    approved: ["approved", "active"],
    declined: ["declined", "rejected", "denied"],
    trash: ["trash", "trashed"],
  };

  return (groups[wanted] ?? [wanted]).includes(actual);
}
function isTrashedStatus(status: string) { return status === "trash" || status === "trashed"; }
function deepValue(input: any, keys: string[]): any {
  if (!input || typeof input !== "object") return undefined;
  for (const key of keys) if (input[key] !== undefined && input[key] !== null && input[key] !== "") return input[key];
  for (const value of Object.values(input)) if (value && typeof value === "object") { const found = deepValue(value, keys); if (found !== undefined) return found; }
  return undefined;
}
function createdCampaigns(r: any) {
  const value = r?.__campaign_count ?? deepValue(r?.__overview, ["created_campaigns", "campaign_count", "campaigns_count", "total_campaigns", "campaigns"]) ?? deepValue(r, ["created_campaigns", "campaign_count", "campaigns_count", "total_campaigns", "campaigns"]);
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
  const [dateRange, setDateRange] = useState<DateRangeKey>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(0);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const makeQ = (fundraiserStatus?: string) => {
  const q = new URLSearchParams({
    page: "1",
    per_page: "100",
  });

  if (fundraiserStatus) {
    q.set("status", fundraiserStatus);
  }

  if (search.trim()) {
    q.set("search", search.trim());
  }

  return q;
};

const statusGroups: Record<string, string[]> = {
  pending: ["pending", "review", "submitted", "inactive"],
  approved: ["approved", "active"],
  declined: ["declined", "rejected", "denied"],
  trash: ["trash", "trashed"],
};

let baseRows: any[] = [];

if (status === "all") {
  baseRows = rowsFrom(
    await adminApi(`fundraisers/paginated?${makeQ()}`)
  );
} else {
  const statuses = statusGroups[status] ?? [status];

  const results = await Promise.all(
    statuses.map(async (backendStatus) => {
      try {
        return rowsFrom(
          await adminApi(
            `fundraisers/paginated?${makeQ(backendStatus)}`
          )
        );
      } catch {
        return [];
      }
    })
  );

  const merged = results.flat();

  const byId = new Map<number, any>();

  for (const row of merged) {
    const id = idOf(row);

    if (id && !byId.has(id)) {
      byId.set(id, row);
    }
  }

  baseRows = Array.from(byId.values()).filter((row) =>
    statusMatches(row, status)
  );
}

      // Render the fundraiser list immediately. Overview enrichment is useful for Created
      // Campaigns / Joined Date, but it must never block the entire page if one overview
      // request is slow or unavailable.
      setRows(baseRows);
      setLoading(false);

      // Load the campaign collection once as a reliable fallback for Created Campaigns.
      // Do not block rendering, and do not replace a valid overview count with a guessed zero.
      void adminApi(`campaigns?page=1&per_page=100&status=all`).then((campaignData) => {
        const campaignRows = rowsFrom(campaignData);
        const counts = new Map<number, number>();
        for (const campaign of campaignRows) {
          const owner = Number(campaign?.author?.id ?? campaign?.author_id ?? campaign?.fundraiser?.id ?? campaign?.fundraiser_id ?? campaign?.user_id ?? campaign?.created_by ?? campaign?.owner_id ?? 0);
          if (owner) counts.set(owner, (counts.get(owner) || 0) + 1);
        }
        setRows((current) => current.map((row) => counts.has(idOf(row)) ? { ...row, __campaign_count: counts.get(idOf(row)) } : row));
      }).catch(() => undefined);

      for (let i = 0; i < baseRows.length; i += 6) {
        const batch = baseRows.slice(i, i + 6);
        const results = await Promise.all(batch.map(async (row) => {
          const id = idOf(row);
          if (!id) return row;
          try {
            const controller = new AbortController();
            const timer = window.setTimeout(() => controller.abort(), 7000);
            try {
              const overview = dataFrom(await adminApi(`fundraiser/${id}/overview`, { signal: controller.signal }));
              return { ...row, __overview: overview };
            } finally {
              window.clearTimeout(timer);
            }
          } catch {
            return row;
          }
        }));

        const byId = new Map(results.map((row) => [idOf(row), row]));
        setRows((current) => current.map((row) => byId.get(idOf(row)) ?? row));
      }
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


const visibleRows = useMemo(() => {
  return rows.filter((r) => {
    if (!statusMatches(r, status)) {
      return false;
    }

    const raw = joinedDate(r);
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

    if (raw && !isDateInRange(raw, dateRange)) {
      return false;
    }

    return true;
  });
}, [rows, dateRange, status, startDate, endDate]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / 10));
  const pageRows = visibleRows.slice((page - 1) * 10, page * 10);
useEffect(() => setPage(1), [
  status,
  search,
  dateRange,
  startDate,
  endDate,
]);

  const formFields = [["first_name", "First name", true], ["last_name", "Last name", false], ["email", "Email", true], ["username", "Username", true], ["password", "Password", false], ["phone", "Phone", false], ["image", "Image / Avatar Media ID", false]] as const;
  const formMarkup = (submitLabel: string, submit: (e: FormEvent) => void) => <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{formFields.map(([k, l, req]) => <label key={k} className="text-sm">{l}<input required={req} type={k === "password" ? "password" : k === "email" ? "email" : "text"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label>)}<div className="sm:col-span-2 flex justify-end"><Button type="submit">{submitLabel}</Button></div></form>;

  return <CardBox className="w-full !max-w-none">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h5 className="card-title">Fundraisers</h5><p className="mt-1 text-sm text-darklink">Fundraiser details, created campaigns, approval status and joined date.</p></div><div className="flex gap-2"><Button variant="outline" onClick={emptyTrash}><Icon icon="solar:trash-bin-trash-line-duotone" /> Empty trash</Button><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Icon icon="solar:user-plus-rounded-line-duotone" /> Create Fundraiser</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create Fundraiser</DialogTitle></DialogHeader>{formMarkup("Create fundraiser", create)}</DialogContent></Dialog></div></div>
    <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_200px]"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fundraisers" className="rounded-md border border-ld bg-transparent px-3 py-2.5" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-ld bg-transparent px-3"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="declined">Declined</option><option value="trash">Trash</option></select>
  <DatePresetSelect
  value={dateRange}
  onChange={setDateRange}
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/>
</div>
{(status !== "all" ||
  search.trim() ||
  dateRange !== "all" ||
  startDate ||
  endDate) && (
  <div className="mt-3 flex flex-wrap items-center gap-2">
    <span className="text-sm font-medium">
      Active filters:
    </span>

    {status !== "all" && (
      <button
        type="button"
        onClick={() => setStatus("all")}
        className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray"
      >
        Status: {status} ×
      </button>
    )}

    {search.trim() && (
      <button
        type="button"
        onClick={() => setSearch("")}
        className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray"
      >
        Search: {search.trim()} ×
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
        Date: {dateRange.replaceAll("_", " ")} ×
      </button>
    )}

    {(startDate || endDate) && dateRange === "all" && (
      <button
        type="button"
        onClick={() => {
          setStartDate("");
          setEndDate("");
        }}
        className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray"
      >
        Date range: {startDate || "…"} – {endDate || "…"} ×
      </button>
    )}

    <button
      type="button"
      onClick={() => {
        setStatus("all");
        setSearch("");
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
<ListPagination
  page={page}
  totalPages={totalPages}
  totalRecords={visibleRows.length}
  pageSize={10}
  recordLabel="fundraisers"
  onPageChange={setPage}
/>    <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit Fundraiser</DialogTitle></DialogHeader>{formMarkup("Save changes", saveEdit)}</DialogContent></Dialog>
  </CardBox>;
}
