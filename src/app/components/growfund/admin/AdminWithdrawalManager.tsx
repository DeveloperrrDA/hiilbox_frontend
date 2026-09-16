"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { adminApi, fmtDate, idOf, money, nameOf, rowsFrom } from "./adminApi";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { isDateInRange, type DateRangeKey } from "@/lib/dashboard/dateRanges";

function deepValue(input: any, keys: string[]): any {
  if (!input || typeof input !== "object") return undefined;
  for (const key of keys) if (input[key] !== undefined && input[key] !== null && input[key] !== "") return input[key];
  for (const value of Object.values(input)) if (value && typeof value === "object") { const found = deepValue(value, keys); if (found !== undefined) return found; }
  return undefined;
}

function requestId(row: any) { return Number(row?.withdrawal_request_id ?? row?.withdrawal_id ?? row?.request_id ?? row?.id ?? row?.ID ?? 0); }
function requestStatus(row: any) { return String(row?.status ?? row?.withdrawal_status ?? row?.request_status ?? "pending").toLowerCase(); }
function statusVariant(status: string): "lightSuccess" | "lightError" | "lightWarning" | "lightPrimary" {
  if (["approved", "paid", "completed", "complete", "success", "successful"].includes(status)) return "lightSuccess";
  if (["declined", "rejected", "failed", "cancelled", "canceled"].includes(status)) return "lightError";
  if (["pending", "processing", "review", "submitted"].includes(status)) return "lightWarning";
  return "lightPrimary";
}

export default function AdminWithdrawalManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRangeKey>("this_year");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const fundraiserRows = rowsFrom(await adminApi("fundraisers/paginated?page=1&per_page=100"));
      const collected: any[] = [];
      for (let i = 0; i < fundraiserRows.length; i += 6) {
        const batch = fundraiserRows.slice(i, i + 6);
        const result = await Promise.all(batch.map(async (fundraiser) => {
          const fundraiserId = idOf(fundraiser);
          if (!fundraiserId) return [];
          try {
            const response = await adminApi(`fundraiser/withdrawal/requests/paginated?fundraiser_id=${fundraiserId}&page=1&per_page=100`);
            return rowsFrom(response).map((request) => ({ ...request, __fundraiser: fundraiser, __fundraiser_id: fundraiserId }));
          } catch {
            return [];
          }
        }));
        result.forEach((group) => collected.push(...group));
      }
      collected.sort((a, b) => {
        const aDate = new Date(deepValue(a, ["created_at", "date_created", "requested_at", "date"]) || 0).getTime();
        const bDate = new Date(deepValue(b, ["created_at", "date_created", "requested_at", "date"]) || 0).getTime();
        return bDate - aDate;
      });
      setRows(collected);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load withdrawal requests.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => void load(), [load]);

  const visibleRows = useMemo(() => rows.filter((row) => {
    const st = requestStatus(row);
    if (status !== "all" && st !== status) return false;
    const fundraiser = row.__fundraiser;
    const haystack = [requestId(row), nameOf(fundraiser), fundraiser?.email, fundraiser?.user_email, deepValue(row, ["method", "payment_method", "payout_method"])].filter(Boolean).join(" ").toLowerCase();
    if (search.trim() && !haystack.includes(search.trim().toLowerCase())) return false;
    const rawDate = deepValue(row, ["created_at", "date_created", "requested_at", "request_date", "date"]);
    if (!isDateInRange(rawDate, dateRange)) return false;
    return true;
  }), [rows, search, status, dateRange]);

  async function updateStatus(row: any, action: "approve" | "decline") {
    const id = requestId(row);
    if (!id) return;
    if (!confirm(`${action === "approve" ? "Approve" : "Decline"} withdrawal request #${id}?`)) return;
    const note = prompt("Optional note:", "");
    if (note === null) return;
    setBusy(id); setError(""); setNotice("");
    try {
      const response = await adminApi("fundraiser/withdrawal/request/update-status", {
        method: "POST",
        body: JSON.stringify({ withdrawal_request_id: id, action, ...(note.trim() ? { note: note.trim() } : {}) }),
      });
      setNotice(response?.message || `Withdrawal ${action === "approve" ? "approved" : "declined"}.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update withdrawal request.");
    } finally {
      setBusy(null);
    }
  }

  return <CardBox>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h5 className="card-title">Withdrawals</h5><p className="mt-1 text-sm text-darklink">Review fundraiser withdrawal requests and approve or decline them.</p></div><Button variant="outline" onClick={() => void load()} disabled={loading}><Icon icon="solar:refresh-line-duotone" /> Refresh</Button></div>
    <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_200px]"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search withdrawals or fundraiser" className="rounded-md border border-ld bg-transparent px-3 py-2.5" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-ld bg-transparent px-3"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="declined">Declined</option><option value="processing">Processing</option><option value="paid">Paid</option></select><DatePresetSelect value={dateRange} onChange={setDateRange}/></div>
    {notice && <div className="mt-4 rounded-md bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}{error && <div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
    <div className="mt-4 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Request</TableHead><TableHead>Fundraiser</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {loading ? <TableRow><TableCell colSpan={7} className="py-10 text-center">Loading withdrawals…</TableCell></TableRow> : visibleRows.length === 0 ? <TableRow><TableCell colSpan={7} className="py-10 text-center text-darklink">No withdrawal requests found.</TableCell></TableRow> : visibleRows.map((row, index) => { const id = requestId(row); const st = requestStatus(row); const fundraiser = row.__fundraiser; const rowCurrency = String(deepValue(row, ["currency", "currency_code", "currency_symbol"]) ?? "$"); const amount = deepValue(row, ["amount", "withdrawal_amount", "requested_amount"]); const method = deepValue(row, ["method", "payment_method", "payout_method", "withdrawal_method"]); const date = deepValue(row, ["created_at", "date_created", "requested_at", "request_date", "date"]); const canReview = ["pending", "review", "submitted", "processing"].includes(st); return <TableRow key={`${id || "request"}-${row.__fundraiser_id}-${index}`}><TableCell>#{id || "—"}</TableCell><TableCell><div className="font-medium">{nameOf(fundraiser) || `Fundraiser #${row.__fundraiser_id}`}</div><div className="text-xs text-darklink">{fundraiser?.email || fundraiser?.user_email || "—"}</div></TableCell><TableCell className="font-medium">{money(amount ?? 0, rowCurrency)}</TableCell><TableCell>{method || "—"}</TableCell><TableCell><Badge variant={statusVariant(st)}>{st}</Badge></TableCell><TableCell>{fmtDate(date)}</TableCell><TableCell className="text-right">{canReview ? <div className="flex justify-end gap-2"><Button size="sm" variant="outline" className="text-success" disabled={busy === id} onClick={() => updateStatus(row, "approve")}><Icon icon="solar:check-circle-line-duotone" /> Approve</Button><Button size="sm" variant="outline" className="text-error" disabled={busy === id} onClick={() => updateStatus(row, "decline")}><Icon icon="solar:close-circle-line-duotone" /> Decline</Button></div> : "—"}</TableCell></TableRow>; })}
    </TableBody></Table></div>
  </CardBox>;
}
