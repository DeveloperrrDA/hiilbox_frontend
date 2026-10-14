"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi, dataFrom, fmtDate, money, rowsFrom } from "./adminApi";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fundraiserId: number;
  fundraiserName?: string;
};

function deepValue(input: any, keys: string[]): any {
  if (!input || typeof input !== "object") return undefined;
  for (const key of keys) {
    if (input[key] !== undefined && input[key] !== null && input[key] !== "") return input[key];
  }
  for (const value of Object.values(input)) {
    if (value && typeof value === "object") {
      const found = deepValue(value, keys);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function requestId(row: any) {
  return Number(row?.withdrawal_request_id ?? row?.withdrawal_id ?? row?.request_id ?? row?.id ?? row?.ID ?? 0);
}

function requestStatus(row: any) {
  return String(row?.status ?? row?.withdrawal_status ?? row?.request_status ?? "pending").toLowerCase();
}

function statusVariant(status: string): "lightSuccess" | "lightError" | "lightWarning" | "lightPrimary" {
  if (["approved", "paid", "completed", "complete", "success", "successful"].includes(status)) return "lightSuccess";
  if (["declined", "rejected", "failed", "cancelled", "canceled"].includes(status)) return "lightError";
  if (["pending", "processing", "review", "submitted"].includes(status)) return "lightWarning";
  return "lightPrimary";
}

function currencyCode(wallet: any, requests: any[]) {
  return String(
    deepValue(wallet, ["currency", "currency_code", "code"]) ??
      deepValue(requests?.[0], ["currency", "currency_code", "code"]) ??
      "$",
  );
}

export default function AdminFundraiserWalletDialog({ open, onOpenChange, fundraiserId, fundraiserName }: Props) {
  const [wallet, setWallet] = useState<any>({});
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [amount, setAmount] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    if (!fundraiserId) return;
    setLoading(true);
    setError("");
    try {
      const [walletResponse, requestResponse] = await Promise.all([
        adminApi(`fundraiser/wallet/info?fundraiser_id=${fundraiserId}`),
        adminApi(`fundraiser/withdrawal/requests/paginated?fundraiser_id=${fundraiserId}&page=1&per_page=100`),
      ]);
      setWallet(dataFrom(walletResponse));
      setRequests(rowsFrom(requestResponse));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load wallet and withdrawal information.");
      setWallet({});
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [fundraiserId]);

  useEffect(() => {
    if (open && fundraiserId) void load();
  }, [open, fundraiserId, load]);

  const currency = useMemo(() => currencyCode(wallet, requests), [wallet, requests]);
  const available = deepValue(wallet, ["available_balance", "available", "balance", "wallet_balance"]);
  const pending = deepValue(wallet, ["pending_balance", "pending", "pending_amount"]);
  const withdrawn = deepValue(wallet, ["withdrawn", "withdrawn_amount", "total_withdrawn", "total_withdrawals"]);

  async function createWithdrawal(e: FormEvent) {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }
    setCreating(true);
    setError("");
    setNotice("");
    try {
      const result = await adminApi("fundraiser/withdrawal/request/create", {
        method: "POST",
        body: JSON.stringify({ fundraiser_id: fundraiserId, amount: Math.round(numericAmount * 100) }),
      });
      setNotice(result?.message || "Withdrawal request created successfully.");
      setAmount("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create withdrawal request.");
    } finally {
      setCreating(false);
    }
  }

  async function updateStatus(row: any, action: string) {
    const id = requestId(row);
    if (!id) return;
    const note = prompt(`Optional note for ${action}:`, "");
    if (note === null) return;
    setBusy(id);
    setError("");
    setNotice("");
    try {
      const result = await adminApi("fundraiser/withdrawal/request/update-status", {
        method: "POST",
        body: JSON.stringify({ withdrawal_request_id: id, action, ...(note.trim() ? { note: note.trim() } : {}) }),
      });
      setNotice(result?.message || `Withdrawal ${action} action completed.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update withdrawal status.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{fundraiserName ? `${fundraiserName} — Wallet & Withdrawals` : "Wallet & Withdrawals"}</DialogTitle>
        </DialogHeader>

        {notice && <div className="rounded-md bg-lightsuccess px-4 py-3 text-sm text-success">{notice}</div>}
        {error && <div className="rounded-md bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-ld p-4"><div className="text-xs text-darklink">Available balance</div><div className="mt-1 text-lg font-semibold">{money(available ?? 0, currency)}</div></div>
          <div className="rounded-md border border-ld p-4"><div className="text-xs text-darklink">Pending balance</div><div className="mt-1 text-lg font-semibold">{money(pending ?? 0, currency)}</div></div>
          <div className="rounded-md border border-ld p-4"><div className="text-xs text-darklink">Total withdrawn</div><div className="mt-1 text-lg font-semibold">{money(withdrawn ?? 0, currency)}</div></div>
        </div>

        <form onSubmit={createWithdrawal} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm">Withdrawal amount<input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2" /></label>
          <Button type="submit" disabled={creating || loading}><Icon icon="solar:wallet-money-line-duotone" /> {creating ? "Creating…" : "Create Withdrawal"}</Button>
        </form>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Request</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="py-8 text-center">Loading wallet and withdrawals…</TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-darklink">No withdrawal requests found.</TableCell></TableRow>
              ) : requests.map((row) => {
                const id = requestId(row);
                const status = requestStatus(row);
                const rowCurrency = String(deepValue(row, ["currency", "currency_code", "code"]) ?? currency);
                const rowAmount = deepValue(row, ["amount", "withdrawal_amount", "requested_amount"]);
                const method = deepValue(row, ["method", "payment_method", "payout_method", "withdrawal_method"]);
                const date = deepValue(row, ["created_at", "date_created", "created", "requested_at", "request_date", "date"]);
                const canReview = ["pending", "review", "submitted", "processing"].includes(status);
                return (
                  <TableRow key={id || JSON.stringify(row)}>
                    <TableCell>#{id || "—"}</TableCell>
                    <TableCell>{money(rowAmount ?? 0, rowCurrency)}</TableCell>
                    <TableCell>{method || "—"}</TableCell>
                    <TableCell><Badge variant={statusVariant(status)}>{status}</Badge></TableCell>
                    <TableCell>{fmtDate(date)}</TableCell>
                    <TableCell className="text-right">
                      {canReview ? <div className="flex justify-end gap-2"><Button size="sm" variant="outline" className="text-success" disabled={busy === id} onClick={() => updateStatus(row, "approve")}>Approve</Button><Button size="sm" variant="outline" className="text-error" disabled={busy === id} onClick={() => updateStatus(row, "decline")}>Decline</Button></div> : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
