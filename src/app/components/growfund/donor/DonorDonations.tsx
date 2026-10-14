"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import CardBox from "@/app/components/shared/CardBox";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import DonationDetailsModal from "@/app/components/growfund/donor/DonationDetailsModal";

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

import {
  isDateInRange,
  type DateRangeKey,
} from "@/lib/dashboard/dateRanges";

import { campaignImage } from "@/lib/dashboard/campaignMedia";

function val(d: any, ...keys: string[]) {
  for (const k of keys) {
    if (d?.[k] != null) return d[k];
  }

  return undefined;
}

function rawDate(d: any) {
  return val(
    d,
    "created_at",
    "date_created",
    "date",
    "created"
  );
}

function donationId(d: any) {
  return Number(
    val(d, "id", "donation_id") ?? 0
  );
}

function donationStatus(d: any) {
  return String(
    val(d, "payment_status", "status") ??
      "unknown"
  ).toLowerCase();
}

function isPending(d: any) {
  return donationStatus(d) === "pending";
}

export default function DonorDonations() {
 const [rows, setRows] = useState<any[]>([]);
const [stats, setStats] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [busy, setBusy] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [detail, setDetail] = useState<any>(null);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] =
    useState<DateRangeKey>("this_year");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const id = currentUserId();

      if (!id) {
        throw new Error(
          "Unable to identify donor."
        );
      }

     const [donationsData, statsData] = await Promise.all([
  dashboardApi(
    `donor/${id}/donations?page=1&per_page=100&orderby=id&order=desc`
  ),
  dashboardApi(`donor/${id}/stats`),
]);

setRows(dashboardRows(donationsData));
setStats(statsData?.data ?? statsData ?? null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load donations."
      );

      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

 const visibleRows = useMemo(() => {
  const term = search.trim().toLowerCase();

  return rows.filter((d) => {
    if (!isDateInRange(rawDate(d), dateRange)) {
      return false;
    }

    const status = donationStatus(d);

    if (
      statusFilter !== "all" &&
      status !== statusFilter
    ) {
      return false;
    }

    if (term) {
      const searchable = [
        donationId(d),
        d?.campaign?.title,
        val(d, "campaign_title", "title"),
        val(d, "campaign_id"),
        val(d, "uid", "donation_uid"),
        val(d, "amount", "donation_amount", "total"),
        status,
      ]
        .filter((value) => value != null)
        .join(" ")
        .toLowerCase();

      if (!searchable.includes(term)) {
        return false;
      }
    }

    return true;
  });
}, [rows, dateRange, search, statusFilter]);

  async function cancelDonation(
    donation: any
  ) {
    const id = donationId(donation);

    if (!id) {
      setError(
        "Unable to identify this donation."
      );
      return;
    }

    if (!isPending(donation)) {
      setError(
        "Only pending donations can be cancelled."
      );
      return;
    }

    if (
      !confirm(
        "Cancel this pending donation?"
      )
    ) {
      return;
    }

    setBusy(id);
    setError("");
    setNotice("");

    try {
      const response = await dashboardApi(
        `donation/${id}/update-status`,
        {
          method: "POST",
          body: JSON.stringify({
            action: "cancel",
          }),
        }
      );

      setNotice(
        response?.message ||
          "Donation cancelled."
      );

      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to cancel donation."
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <CardBox>
      <div>
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h5 className="card-title">
        My Donations
      </h5>

      <p className="mt-1 text-sm text-darklink">
        Your donation history.
      </p>
    </div>
  </div>

  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-md border p-4">
      <p className="text-sm text-darklink">
        Total Donations
      </p>
      <p className="mt-1 text-xl font-semibold">
        {Number(
          stats?.total_number_of_donations ?? 0
        ).toLocaleString()}
      </p>
    </div>

    <div className="rounded-md border p-4">
      <p className="text-sm text-darklink">
        Supported Campaigns
      </p>
      <p className="mt-1 text-xl font-semibold">
        {Number(
          stats?.total_supported_campaigns ?? 0
        ).toLocaleString()}
      </p>
    </div>

    <div className="rounded-md border p-4">
      <p className="text-sm text-darklink">
        Total Contributions
      </p>
      <p className="mt-1 text-xl font-semibold">
        ${Number(
          stats?.total_contributions ?? 0
        ).toFixed(2)}
      </p>
    </div>

    <div className="rounded-md border p-4">
      <p className="text-sm text-darklink">
        Average Contribution
      </p>
      <p className="mt-1 text-xl font-semibold">
        ${Number(
          stats?.average_contributions ?? 0
        ).toFixed(2)}
      </p>
    </div>
  </div>

  <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
    <input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search donations..."
      className="h-10 w-full rounded-md border border-border bg-transparent px-3 text-sm outline-none lg:max-w-xs"
    />

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
      className="h-10 rounded-md border border-border bg-transparent px-3 text-sm outline-none"
    >
      <option value="all">All Statuses</option>
      <option value="paid">Paid</option>
      <option value="completed">Completed</option>
      <option value="pending">Pending</option>
      <option value="cancelled">Cancelled</option>
      <option value="failed">Failed</option>
    </select>

    <DatePresetSelect
      value={dateRange}
      onChange={setDateRange}
    />
  </div>
</div>

      {notice && (
        <div className="mt-5 rounded-md border border-success/30 bg-lightsuccess px-4 py-3 text-sm text-success">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="mt-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Donation
              </TableHead>

              <TableHead>
                Campaign
              </TableHead>

              <TableHead>
                Amount
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-darklink"
                >
                  Loading donations…
                </TableCell>
              </TableRow>
            ) : visibleRows.length ? (
              visibleRows.map(
                (d, i) => {
                  const id =
                    donationId(d);

                  const status =
                    donationStatus(d);

                  const raw =
                    rawDate(d);

                  const date = raw
                    ? new Date(raw)
                    : null;

                  const image =
                    campaignImage(d);

                  return (
                    <TableRow
                      key={id || i}
                    >
                      <TableCell className="font-medium">
                        #
                        {id ||
                          "—"}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={image}
                              alt=""
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <span className="h-10 w-10 shrink-0 rounded-md bg-lightgray" />
                          )}

                          <span>
                            {d?.campaign
                              ?.title ??
                              val(
                                d,
                                "campaign_title",
                                "title"
                              ) ??
                              `Campaign #${
                                val(
                                  d,
                                  "campaign_id"
                                ) ??
                                "—"
                              }`}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        $
                        {Number(
                          val(
                            d,
                            "amount",
                            "donation_amount",
                            "total"
                          ) ?? 0
                        ).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            [
                              "paid",
                              "completed",
                              "successful",
                              "success",
                            ].includes(
                              status
                            )
                              ? "lightSuccess"
                              : "lightPrimary"
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {date &&
                        !Number.isNaN(
                          date.getTime()
                        )
                          ? date.toLocaleDateString()
                          : "—"}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setDetail(d)
                            }
                          >
                            View Details
                          </Button>

                          {isPending(d) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-error"
                              disabled={
                                busy === id
                              }
                              onClick={() =>
                                void cancelDonation(
                                  d
                                )
                              }
                            >
                              {busy === id
                                ? "Cancelling…"
                                : "Cancel Donation"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-darklink"
                >
                  No donations found
                  for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {detail && (
        <DonationDetailsModal
          donation={detail}
          onClose={() =>
            setDetail(null)
          }
        />
      )}
    </CardBox>
  );
}