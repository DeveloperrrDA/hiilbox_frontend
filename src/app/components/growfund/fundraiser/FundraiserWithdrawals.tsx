"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import CardBox from "@/app/components/shared/CardBox";
import ColumnVisibilityControl from "@/app/components/growfund/shared/ColumnVisibilityControl";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import ListPagination from "@/app/components/growfund/shared/ListPagination";
import {
  isDateInRange,
  type DateRangeKey,
} from "@/lib/dashboard/dateRanges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  currentUserId,
  dashboardApi,
  dashboardRows,
} from "@/lib/dashboard/api";

function pick(r: any, ...keys: string[]) {
  for (const k of keys) {
    if (r?.[k] != null) {
      return r[k];
    }
  }

  return undefined;
}
function decisionDate(r: any, status: string) {
  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus === "approved" ||
    normalizedStatus === "declined" ||
    normalizedStatus === "rejected"
  ) {
    return pick(r, "updated_at");
  }

  return undefined;
}
function fmtDateTime(value: any) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}
export default function FundraiserWithdrawals() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dateRange, setDateRange] =
  useState<DateRangeKey>("all");

const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const id = currentUserId();

    if (!id) {
      setError(
        "Unable to identify your fundraiser account."
      );
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const q = new URLSearchParams({
        fundraiser_id: String(id),
        page: "1",
        per_page: "100",
        orderby: "id",
        order: "desc",
      });

      if (startDate) {
        q.set("start_date", startDate);
      }

      if (endDate) {
        q.set("end_date", endDate);
      }

      const data = await dashboardApi(
        `fundraiser/withdrawal/requests/paginated?${q.toString()}`
      );

const withdrawalRows = dashboardRows(data);

setRows(dashboardRows(data));   } catch (e) {
      setRows([]);

      setError(
        e instanceof Error
          ? e.message
          : "Unable to load withdrawals."
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
}, [dateRange, startDate, endDate]);
  const filteredRows = useMemo(() => {
  return rows.filter((r) => {
    const raw = pick(
      r,
      "created_at",
      "date_created",
      "created",
      "date"
    );

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

    if (!isDateInRange(raw, dateRange)) {
      return false;
    }

    return true;
  });
}, [rows, dateRange, startDate, endDate]);

const pages = Math.max(
  1,
  Math.ceil(filteredRows.length / 10)
);

const visible = useMemo(
  () =>
    filteredRows.slice(
      (page - 1) * 10,
      page * 10
    ),
  [filteredRows, page]
);

  return (
    <CardBox className="w-full !max-w-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h5 className="card-title">
            My withdrawal requests
          </h5>

          <p className="mt-1 text-sm text-darklink">
            Track requests sent from your wallet.
            Approval and decline controls are reserved
            for administrators.
          </p>
        </div>

        <div className="flex gap-2">
         <DatePresetSelect
  value={dateRange}
  onChange={setDateRange}
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <ColumnVisibilityControl
          tableClass="fundraiser-withdrawals-table"
          columns={[
            "Request",
            "Amount",
            "Method",
            "Status",
            "Date",
            "Note",
          ]}
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <Table className="fundraiser-withdrawals-table">
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-darklink"
                >
                  Loading withdrawals…
                </TableCell>
              </TableRow>
            ) : visible.length ? (
              visible.map((r, i) => {
                const status = String(
                  pick(
                    r,
                    "status",
                    "request_status"
                  ) ?? "pending"
                );
                 const statusDate = decisionDate(r, status);
                const raw = pick(
                  r,
                  "created_at",
                  "date_created",
                  "created",
                  "date"
                );

                const d = raw
                  ? new Date(raw)
                  : null;

                const requestId = pick(
                  r,
                  "id",
                  "withdrawal_request_id"
                );

                const amount = Number(
                  pick(
                    r,
                    "amount",
                    "withdrawal_amount"
                  ) ?? 0
                );

                const method = pick(
                  r,
                  "method",
                  "payment_method"
                );

                const note = pick(
                  r,
                  "note",
                  "admin_note"
                );

                return (
                  <TableRow
                    key={requestId ?? i}
                  >
                    <TableCell className="font-medium">
                      #{requestId ?? "—"}
                    </TableCell>

                    <TableCell>
                      $
                      {Number.isFinite(amount)
                        ? amount.toFixed(2)
                        : "0.00"}
                    </TableCell>

                    <TableCell>
                      {String(method ?? "—")}
                    </TableCell>
<TableCell>
  <div className="flex items-center gap-2">
    <Badge
      variant={
        status.toLowerCase() === "approved"
          ? "lightSuccess"
          : ["declined", "rejected"].includes(
                status.toLowerCase()
              )
            ? "lightError"
            : "lightWarning"
      }
    >
      {status}
    </Badge>

    {["approved", "declined", "rejected"].includes(
      status.toLowerCase()
    ) &&
      statusDate && (
        <button
          type="button"
          title={`${
            status.toLowerCase() === "approved"
              ? "Approved"
              : "Declined"
          }: ${fmtDateTime(statusDate)}`}
          aria-label={`${
            status.toLowerCase() === "approved"
              ? "Approved"
              : "Declined"
          } on ${fmtDateTime(statusDate)}`}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-ld text-xs font-semibold text-darklink hover:bg-lightgray"
        >
          i
        </button>
      )}
  </div>
</TableCell>
                    <TableCell>
                      {d &&
                      !Number.isNaN(d.getTime())
                        ? d.toLocaleDateString()
                        : "—"}
                    </TableCell>

                    <TableCell className="max-w-64 truncate">
                      {String(note ?? "—")}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-darklink"
                >
                  No withdrawal requests found for
                  this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

     <ListPagination
  page={page}
  totalPages={pages}
  totalRecords={filteredRows.length}
  pageSize={10}
  onPageChange={setPage}
/>   </CardBox>
  );
}