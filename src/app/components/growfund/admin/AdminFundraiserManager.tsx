"use client";

import Link from "next/link";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import ListPagination from "@/app/components/growfund/shared/ListPagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { adminApi, dataFrom, fmtDate, idOf, nameOf, rowsFrom } from "./adminApi";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { isDateInRange, type DateRangeKey } from "@/lib/dashboard/dateRanges";

const blank = { first_name: "", last_name: "", email: "", username: "", password: "", phone: "", image: "" };

function declineReasonOf(r: any) {
  const sources = [
    r,
    r?.fundraiser,
    r?.profile,
    r?.data,
    r?.__overview?.fundraiser,
    r?.__overview?.profile,
    r?.__overview,
  ];

  for (const source of sources) {
    if (!source || typeof source !== "object") {
      continue;
    }

    const reason =
      source?.decline_reason ??
      source?.declineReason;

    if (!reason) {
      continue;
    }

    if (typeof reason === "string") {
      return {
        message: reason,
        created_at: "",
        user_id: null,
      };
    }

    if (
      typeof reason === "object" &&
      String(reason?.message ?? "").trim()
    ) {
      return reason;
    }
  }

  return null;
}

function statusOf(r: any) {
  const rawStatus = String(
    r?.status ??
      r?.fundraiser_status ??
      r?.approval_status ??
      r?.fundraiser?.status ??
      r?.profile?.status ??
      r?.data?.status ??
      ""
  )
    .trim()
    .toLowerCase();

  if (
    rawStatus === "inactive" &&
    declineReasonOf(r)
  ) {
    return "declined";
  }

  return rawStatus || "pending";
}
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
const [selected, setSelected] = useState<number[]>([]);
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

const [rejectFundraiser, setRejectFundraiser] = useState<any | null>(null);
const [rejectReason, setRejectReason] = useState("");
const [rejecting, setRejecting] = useState(false);

const [declineDetailsFundraiser, setDeclineDetailsFundraiser] =
  useState<any | null>(null);


  const load = useCallback(async () => {
    setLoading(true);
    setError("");

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
  pending: [
    "pending",
    "review",
    "submitted",
    "inactive",
  ],
  approved: [
    "approved",
    "active",
  ],
  declined: [
    "inactive",
    "declined",
    "rejected",
    "denied",
  ],
  trash: [
    "trash",
    "trashed",
  ],
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
useEffect(() => {
  async function testUsersApi() {
    try {
      const result = await adminApi(
        "users/paginated?page=1&per_page=10&orderby=id&order=desc"
      );

      console.log("ADMIN USERS RESPONSE:", result);
    } catch (error) {
      console.error("ADMIN USERS ERROR:", error);
    }
  }

  void testUsersApi();
}, []);
  async function action(r: any, actionName: string, reason?: string) {
    const id = idOf(r); setBusy(id); setError("");
    try {
      const d = await adminApi(`fundraiser/${id}/update-status`, { method: "POST", body: JSON.stringify({ action: actionName, ...(reason ? { reason } : {}) }) });
      setNotice(d?.message || `Fundraiser ${actionName} action completed.`); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Fundraiser action failed."); }
    finally { setBusy(null); }
  }

  async function approve(r: any) { if (confirm("Approve this fundraiser?")) await action(r, "approve"); }
function decline(r: any) {
  setRejectFundraiser(r);
  setRejectReason("");
  setError("");
}

async function submitReject() {
  if (!rejectFundraiser) return;

  const reason = rejectReason.trim();

  if (!reason) {
    setError("Please enter a reason for rejecting this fundraiser.");
    return;
  }

  setRejecting(true);
  setError("");

  try {
    await action(rejectFundraiser, "decline", reason);
    setRejectFundraiser(null);
    setRejectReason("");
  } finally {
    setRejecting(false);
  }
}
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
  const totalFundraisers = visibleRows.length;
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

const pageIds = pageRows
  .map((r: any) => idOf(r))
  .filter((id: number) => id > 0);

const allSelected =
  pageIds.length > 0 &&
  pageIds.every((id: number) => selected.includes(id));

function toggleSelected(id: number) {
  setSelected((current) =>
    current.includes(id)
      ? current.filter((value) => value !== id)
      : [...current, id]
  );
}

function toggleAllSelected() {
  setSelected((current) => {
    if (allSelected) {
      return current.filter((id) => !pageIds.includes(id));
    }

    return Array.from(new Set([...current, ...pageIds]));
  });
}

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
<div className="mt-4 flex justify-end">
  <ColumnVisibilityControl
    tableClass="admin-fundraisers-table"
    columns={[
      "Select",
      "Fundraiser Details",
      "Created Campaigns",
      "Status",
      "Joined Date",
      "Actions",
    ]}
  />
</div>

<div className="mt-4 overflow-x-auto">
  <Table className="admin-fundraisers-table">
    <TableHeader>
      <TableRow>
        <TableHead className="w-10">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAllSelected}
            aria-label="Select all fundraisers on this page"
          />
        </TableHead>

        <TableHead>Fundraiser Details</TableHead>
        <TableHead>Created Campaigns</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Joined Date</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>      {loading ? <TableRow><TableCell colSpan={6} className="py-10 text-center">Loading fundraisers…</TableCell></TableRow> : visibleRows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-10 text-center text-darklink">No fundraisers found. If this account has fundraisers, verify the logged-in admin JWT is valid.</TableCell></TableRow> : pageRows.map((r) => {
  const id = idOf(r);
  const st = statusOf(r);

  const pending = [
    "pending",
    "review",
    "submitted",
    "inactive",
  ].includes(st);

  const declineReason = declineReasonOf(r);
       return <TableRow key={id}>
  <TableCell>
    <Checkbox
      checked={selected.includes(id)}
      onCheckedChange={() => toggleSelected(id)}
      aria-label={`Select fundraiser ${id}`}
    />
  </TableCell>

  <TableCell><Link href={`/dashboard/fundraisers/${id}`} className="font-medium hover:text-primary">{nameOf(r) || `Fundraiser #${id}`}</Link><div className="text-xs text-darklink">{r.email || r.user_email || "—"}{r.phone ? ` · ${r.phone}` : ""}</div></TableCell>
        <TableCell>{createdCampaigns(r)}</TableCell>
        <TableCell>
  {pending ? (
    <div className="flex items-center gap-2">
      <Badge variant="lightWarning">
        {st}
      </Badge>

      <Button
        size="sm"
        variant="outline"
        className="text-success"
        disabled={busy === id}
        onClick={() => approve(r)}
        title="Approve"
      >
        <Icon icon="solar:check-circle-bold" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="text-error"
        disabled={busy === id}
        onClick={() => decline(r)}
        title="Decline"
      >
        <Icon icon="solar:close-circle-bold" />
      </Button>
    </div>
  ) : st === "declined" ? (
    <div className="flex items-center gap-2">
      <Badge variant="lightError">
        Declined
      </Badge>

      {declineReason && (
        <button
          type="button"
          onClick={() => setDeclineDetailsFundraiser(r)}
          className="inline-flex items-center"
          title="View decline reason"
          aria-label="View decline reason"
        >
          <Icon
            icon="solar:info-circle-line-duotone"
            className="text-lg"
          />
        </button>
      )}
    </div>
  ) : (
    <Badge
      variant={
        st === "approved" || st === "active"
          ? "lightSuccess"
          : isTrashedStatus(st)
            ? "lightError"
            : "lightPrimary"
      }
    >
      {st}
    </Badge>
  )}
</TableCell>
        <TableCell>{fmtDate(joinedDate(r))}</TableCell>
        <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" disabled={busy === id}><Icon icon="solar:menu-dots-bold" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52"><DropdownMenuItem onClick={() => beginEdit(r)}>
  <Icon icon="solar:pen-2-line-duotone" /> Edit / Update
</DropdownMenuItem>

{pending && (
  <>
    <DropdownMenuItem onClick={() => approve(r)}>
      <Icon icon="solar:check-circle-line-duotone" />
      Approve
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => decline(r)}>
      <Icon icon="solar:close-circle-line-duotone" />
      Decline
    </DropdownMenuItem>
  </>
)}

<DropdownMenuSeparator />{isTrashedStatus(st) ? <><DropdownMenuItem onClick={() => restore(r)}><Icon icon="solar:restart-line-duotone" /> Restore</DropdownMenuItem><DropdownMenuItem className="text-error" onClick={() => remove(r, true)}>Delete permanently</DropdownMenuItem></> : <DropdownMenuItem className="text-error" onClick={() => remove(r, false)}>Move to trash</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></TableCell>
      </TableRow>; })}
    </TableBody></Table></div>
    <ListPagination
  page={page}
  totalPages={totalPages}
  totalRecords={totalFundraisers}
  pageSize={10}
  recordLabel="fundraisers"
  onPageChange={setPage}
/>
<Dialog
  open={Boolean(rejectFundraiser)}
  onOpenChange={(isOpen) => {
    if (!isOpen && !rejecting) {
      setRejectFundraiser(null);
      setRejectReason("");
      setError("");
    }
  }}
>
  <DialogContent className="max-w-[820px] gap-0 overflow-hidden p-0">
    <DialogHeader className="border-b border-ld px-6 py-5">
      <DialogTitle className="text-xl font-medium">
        Decline fundraiser?
      </DialogTitle>
    </DialogHeader>

    <div className="bg-lightgray px-6 py-6 dark:bg-darkgray">
      <label className="block">
        <span className="text-lg font-medium">
          Reason
        </span>

        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={3}
          placeholder="e.g., the fundraiser is not suitable for the campaign."
          className="mt-3 w-full resize-y rounded-md border border-ld bg-white px-4 py-3 text-base outline-none placeholder:text-darklink focus:border-primary dark:bg-dark"
        />
      </label>

      <p className="mt-3 text-base leading-7 text-darklink">
        When you deny the fundraiser, he will not be live and
        will not take part in the fundraising campaign.
      </p>
    </div>

    <div className="flex justify-end gap-3 border-t border-ld bg-white px-6 py-5 dark:bg-dark">
      <Button
        type="button"
        variant="outline"
        disabled={rejecting}
        onClick={() => {
          setRejectFundraiser(null);
          setRejectReason("");
          setError("");
        }}
      >
        Cancel
      </Button>

      <Button
        type="button"
        disabled={rejecting || !rejectReason.trim()}
        onClick={() => void submitReject()}
        className="bg-error px-6 text-white hover:bg-error/90"
      >
        {rejecting ? "Denying..." : "Deny Fundraiser"}
      </Button>
    </div>
  </DialogContent>
</Dialog>

<Dialog
  open={Boolean(declineDetailsFundraiser)}
  onOpenChange={(isOpen) => {
    if (!isOpen) {
      setDeclineDetailsFundraiser(null);
    }
  }}
>
  <DialogContent className="max-w-[820px] gap-0 overflow-hidden p-0">
    <DialogHeader className="border-b border-ld px-6 py-5">
      <DialogTitle className="text-xl font-medium">
        Declined fundraiser
      </DialogTitle>
    </DialogHeader>

    <div className="bg-lightgray px-6 py-6 dark:bg-darkgray">
      <p className="text-lg font-medium">
        Reason
      </p>

      <div className="mt-3 min-h-[90px] rounded-md border border-ld bg-white px-4 py-3 text-base leading-7 dark:bg-dark">
        {declineDetailsFundraiser
          ? declineReasonOf(declineDetailsFundraiser)?.message ||
            "No reason provided."
          : "No reason provided."}
      </div>

      {declineDetailsFundraiser &&
        declineReasonOf(declineDetailsFundraiser)?.created_at && (
          <p className="mt-3 text-sm text-darklink">
            Declined on{" "}
            {String(
              declineReasonOf(declineDetailsFundraiser)?.created_at
            )}
          </p>
        )}
    </div>

    <div className="flex justify-end border-t border-ld bg-white px-6 py-5 dark:bg-dark">
      <Button
        type="button"
        variant="outline"
        onClick={() => setDeclineDetailsFundraiser(null)}
      >
        Close
      </Button>
    </div>
  </DialogContent>
</Dialog>
  </CardBox>;
}
