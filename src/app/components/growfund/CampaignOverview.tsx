"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import { dateRangeParams, type DateRangeKey } from "@/lib/dashboard/dateRanges";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";

type AnyRecord = Record<string, any>;

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
function unwrapPayload(value: any, entityKey?: string): AnyRecord {
  let current = value;

  for (
    let i = 0;
    i < 4 &&
    current &&
    typeof current === "object" &&
    !Array.isArray(current);
    i++
  ) {
    if (
      entityKey &&
      current[entityKey] &&
      typeof current[entityKey] === "object"
    ) {
      return current[entityKey];
    }

    if (
      current.data &&
      typeof current.data === "object" &&
      !Array.isArray(current.data)
    ) {
      current = current.data;
      continue;
    }

    break;
  }

  if (
    entityKey &&
    current?.[entityKey] &&
    typeof current[entityKey] === "object"
  ) {
    return current[entityKey];
  }

  return current && typeof current === "object" ? current : {};
}

function rowsFromPayload(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  for (const key of [
    "data",
    "items",
    "results",
    "rows",
    "records",
    "donations",
  ]) {
    const rows = rowsFromPayload(value[key]);

    if (rows.length) return rows;
  }

  return [];
}
function findByKeys(input: any, keys: string[]): any {
  if (!input || typeof input !== "object") return undefined;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(input, key) && input[key] !== null && input[key] !== "") return input[key];
  }
  for (const value of Object.values(input)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const found = findByKeys(value, keys);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function numberFrom(data: AnyRecord, keys: string[]) {
  const value = findByKeys(data, keys);
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function textFrom(data: AnyRecord, keys: string[]) {
  const value = findByKeys(data, keys);
  return value === undefined || value === null ? "" : String(value);
}

function formatMoney(value: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `$${value.toLocaleString()}`;
  }
}



export default function CampaignOverview({ id }: { id: string }) {
  const [updatedNotice, setUpdatedNotice] = useState(false);
  const [data, setData] = useState<AnyRecord>({});
  const [campaign, setCampaign] = useState<AnyRecord>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>("this_year");
  const [paidDonationCount, setPaidDonationCount] = useState<number | null>(null);
  const [donationRows, setDonationRows] = useState<any[]>([]);
  const load = useCallback(async () => {
    const token = localStorage.getItem("access_token") || "";
    if (!token) {
      setError("Please sign in to view campaign analytics.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const range = dateRangeParams(dateRange);
      const qs = new URLSearchParams({ start_date: range.start_date, end_date: range.end_date });
      const headers = { Authorization: `Bearer ${token}` };
      const isAdmin = dashboardRole(savedDashboardUser()) === "admin";
      const overviewUrl = isAdmin
        ? `/api/admin/growfund/campaigns/${id}/overview?${qs.toString()}`
        : `/api/dashboard/campaigns/${id}/overview?${qs.toString()}`;
      const campaignUrl = isAdmin
        ? `/api/admin/growfund/campaigns/${id}`
        : `/api/dashboard/campaigns/${id}`;
const donationUrl = isAdmin
  ? `/api/admin/growfund/donations/paginated?page=1&per_page=100&campaign_id=${encodeURIComponent(id)}&orderby=id&order=desc`
  : `/api/dashboard/growfund/donations/paginated?page=1&per_page=100&campaign_id=${encodeURIComponent(id)}&orderby=id&order=desc`;      const [overviewResponse, campaignResponse, donationResponse] = await Promise.all([
        fetch(overviewUrl, { headers, cache: "no-store" }),
        fetch(campaignUrl, { headers, cache: "no-store" }),
        fetch(donationUrl, { headers, cache: "no-store" }),
      ]);
      const [overviewJson, campaignJson, donationJson] = await Promise.all([overviewResponse.json(), campaignResponse.json(), donationResponse.json().catch(() => null)]);
      if (!overviewResponse.ok) throw new Error(overviewJson?.message || "Unable to load campaign overview.");
      if (!campaignResponse.ok) throw new Error(campaignJson?.message || "Unable to load campaign details.");
      setData(unwrapPayload(overviewJson));
setCampaign(unwrapPayload(campaignJson, "campaign"));
     if (donationResponse.ok) {
  console.log("CAMPAIGN OVERVIEW RESPONSE:", overviewJson);
  console.log("CAMPAIGN RESPONSE:", campaignJson);
  console.log("DONATION RESPONSE:", donationJson);

  const rows = rowsFromPayload(donationJson);

  setDonationRows(rows);

  setPaidDonationCount(
    rows.filter((d: any) => {
      const payment = String(d?.payment_status ?? "").toLowerCase();
      const status = String(d?.status ?? "").toLowerCase();

      return payment
        ? payment === "paid"
        : ["paid", "completed", "complete", "successful", "success"].includes(status);
    }).length
  );
} else {
  setDonationRows([]);
  setPaidDonationCount(null);
}
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load campaign overview.");
    } finally {
      setLoading(false);
    }
  }, [id, dateRange]);

  useEffect(() => {
    if (sessionStorage.getItem("growfund_campaign_updated") === id) {
      setUpdatedNotice(true);
      sessionStorage.removeItem("growfund_campaign_updated");
    }
    void load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const currency = textFrom(data, ["currency", "currency_code"]) || textFrom(campaign, ["currency", "currency_code"]) || "USD";
  const metrics = data?.metrics ?? {};

const metricNumber = (metric: any): number => {
  if (metric === null || metric === undefined) return 0;

  if (typeof metric === "number") {
    return Number.isFinite(metric) ? metric : 0;
  }

  if (typeof metric === "string") {
    const parsed = Number(metric.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (typeof metric === "object") {
    const raw =
      metric.value ??
      metric.amount ??
      metric.total ??
      metric.count ??
      metric.current ??
      metric.total_amount ??
      metric.donation_amount;

    if (raw !== undefined && raw !== null) {
      const parsed = Number(
        String(raw).replace(/[^0-9.-]/g, "")
      );

      return Number.isFinite(parsed) ? parsed : 0;
    }
  }

  return 0;
};


const donations =
  paidDonationCount ??
  numberFrom(data, [
    "donations",
    "donation_count",
    "total_donations",
    "number_of_donations",
    "contributions",
    "contribution_count"
  ]);





const totalDonation =
  metricNumber(metrics.total_donation) ||
  numberFrom(data, [
    "total_donation",
    "total_donations_amount",
    "gross_donation",
    "gross_amount",
    "raised_amount",
    "fund_raised",
    "total_raised",
    "raised",
    "amount_raised",
  ]);

const netDonation =
  metricNumber(metrics.net_donation) ||
  numberFrom(data, [
    "net_donation",
    "net_donations",
    "net_amount",
    "total_net_donation",
    "total_net_amount",
  ]);

const totalDonors =
  metricNumber(metrics.total_donors) ||
  numberFrom(data, [
    "total_donors",
    "donors",
    "donor_count",
    "unique_donors",
    "contributors",
    "number_of_contributors",
  ]);

const averageDonation =
  metricNumber(metrics.average_donation) ||
  numberFrom(data, [
    "average_donation",
    "avg_donation",
    "average_amount",
  ]) ||
  (donations > 0 ? totalDonation / donations : 0);
 const rangeStart = textFrom(data, ["start_date", "from_date"]);
const rangeEnd = textFrom(data, ["end_date", "to_date"]);
const revenueRows = useMemo(() => {
  const rows = Array.isArray(data?.revenue_chart_data)
    ? data.revenue_chart_data
    : [];

  return rows.map((row: any) => ({
    date: String(row?.date ?? ""),
    revenue: Number(row?.revenue ?? 0) || 0,
  }));
}, [data]);

const revenueBreakdown = useMemo(() => {
  return revenueRows.map((revenueRow) => {
    const periodDonations = donationRows.filter((donation: any) => {
      const paymentStatus = String(
        donation?.payment_status ?? ""
      ).toLowerCase();

      const status = String(
        donation?.status ?? ""
      ).toLowerCase();

      const isPaid = paymentStatus
        ? paymentStatus === "paid"
        : ["paid", "completed", "complete", "successful", "success"].includes(
            status
          );

      if (!isPaid || !donation?.created_at) {
        return false;
      }

      const donationDate = new Date(donation.created_at);

      if (Number.isNaN(donationDate.getTime())) {
        return false;
      }

      const donationPeriod = donationDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });

      return donationPeriod === revenueRow.date;
    });

    const totalDonation = periodDonations.reduce(
      (sum: number, donation: any) => {
        const amount = Number(donation?.amount ?? 0);

        return sum + (Number.isFinite(amount) ? amount : 0);
      },
      0
    );

    const uniqueDonors = new Set(
      periodDonations.map((donation: any) => {
        const donorId = donation?.donor?.id;

        if (donorId && String(donorId) !== "0") {
          return `donor-${donorId}`;
        }

        return `donation-${donation?.id ?? donation?.uid ?? donation?.transaction_id}`;
      })
    ).size;

    return {
      date: revenueRow.date,
      donors: uniqueDonors,
      totalDonation,
      netDonation: revenueRow.revenue,
    };
  });
}, [revenueRows, donationRows]);
const revenueChartOptions = useMemo(
  () => ({
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },

    colors: ["#2e9b62"],

    stroke: {
      curve: "straight" as const,
      width: 3,
    },

    dataLabels: {
      enabled: false,
    },

    markers: {
      size: 3,
      strokeWidth: 0,
      hover: {
        size: 6,
      },
    },

    grid: {
      borderColor: "rgba(0,0,0,.08)",
      strokeDashArray: 0,
    },

    xaxis: {
      categories: revenueRows.map((row) => row.date),
      labels: {
        rotate: 0,
        trim: true,
      },
    },

    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value: number) =>
          Number.isInteger(value)
            ? value.toString()
            : value.toFixed(0),
      },
    },

    tooltip: {
      y: {
        formatter: (value: number) =>
          `Revenue: ${formatMoney(value, currency)}`,
      },
    },

    legend: {
      show: false,
    },
  }),
  [revenueRows, currency]
);

const revenueChartSeries = useMemo(
  () => [
    {
      name: "Revenue",
      data: revenueRows.map((row) => row.revenue),
    },
  ],
  [revenueRows]
);
 const stats = [
  ["Total Donation", formatMoney(totalDonation, currency), "solar:wallet-money-line-duotone"],
  ["Net Donation", formatMoney(netDonation, currency), "solar:hand-money-line-duotone"],
  ["Average Donation", formatMoney(averageDonation, currency), "solar:chart-square-line-duotone"],
  ["Total Donors", totalDonors.toLocaleString(), "solar:users-group-rounded-line-duotone"],
];

  return <div className="space-y-6">
    {updatedNotice && <div className="rounded-md border border-success/30 bg-lightsuccess px-4 py-3 text-sm text-success">Campaign changes were saved and submitted to GrowFund for review.</div>}

    <CardBox>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="card-title">{campaign.title || `Campaign #${id}`}</h5>
            {campaign.status && <Badge variant="lightPrimary">{campaign.status}</Badge>}
          </div>
          <p className="mt-1 text-sm text-darklink">GrowFund campaign overview{rangeStart || rangeEnd ? ` · ${rangeStart || "…"} to ${rangeEnd || "…"}` : " · defaults to GrowFund's last 30 days"}.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <DatePresetSelect value={dateRange} onChange={setDateRange} />
          <Button onClick={() => void load()} disabled={loading}><Icon icon="solar:filter-line-duotone" /> Apply</Button>
          <Button variant="outline" asChild><Link href={`/dashboard/campaigns/${id}/edit`}><Icon icon="solar:pen-2-line-duotone" /> Edit</Link></Button>
        </div>
      </div>
      {error && <div className="mt-5 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
    </CardBox>

    <div className="grid grid-cols-12 gap-6">
      {stats.map(([label, value, icon]) => <CardBox key={String(label)} className="col-span-12 sm:col-span-6 xl:col-span-3">
        <div className="flex items-center justify-between"><div><p className="text-sm text-darklink">{label}</p><h4 className="mt-2 text-2xl font-semibold">{loading ? "…" : value}</h4></div><span className="flex h-12 w-12 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon={String(icon)} height={25} /></span></div>
      </CardBox>)}
    </div>

       {/* Revenue for Period */}
    <CardBox>
      <div className="flex items-center gap-2">
        <h5 className="card-title">Revenue for Period</h5>
        <Icon
          icon="solar:info-circle-line-duotone"
          height={18}
          className="text-darklink"
        />
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex h-[330px] items-center justify-center text-darklink">
            Loading revenue data...
          </div>
        ) : revenueRows.length > 0 ? (
          <Chart
            type="line"
            height={330}
            series={revenueChartSeries}
            options={revenueChartOptions as any}
          />
        ) : (
          <div className="flex h-[330px] items-center justify-center text-darklink">
            No revenue data available for this period.
          </div>
        )}
      </div>
    </CardBox>

       {/* Revenue Breakdown */}
    {/* Revenue Breakdown */}
<CardBox>
  <div className="flex items-center gap-2">
    <h5 className="card-title">Revenue Breakdown</h5>

    <Icon
      icon="solar:info-circle-line-duotone"
      height={18}
      className="text-darklink"
    />
  </div>

  <div className="mt-6 overflow-x-auto">
    <table className="w-full min-w-[800px] text-left">
      <thead>
        <tr className="border-b border-ld">
          <th className="px-3 py-4 font-medium text-darklink">
            Date
          </th>

          <th className="px-3 py-4 font-medium text-darklink">
            Donors
          </th>

          <th className="px-3 py-4 font-medium text-darklink">
            Total Donation
          </th>

          <th className="px-3 py-4 font-medium text-darklink">
            Net Donation
          </th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={4}
              className="px-3 py-8 text-center text-darklink"
            >
              Loading revenue breakdown...
            </td>
          </tr>
        ) : revenueBreakdown.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="px-3 py-8 text-center text-darklink"
            >
              No revenue data available for this period.
            </td>
          </tr>
        ) : (
          revenueBreakdown.map((row, index) => (
            <tr
              key={`${row.date}-${index}`}
              className={
                index % 2 === 1
                  ? "bg-lightgray dark:bg-darkgray"
                  : ""
              }
            >
              <td className="px-3 py-5">
                {row.date}
              </td>

              <td className="px-3 py-5">
                {row.donors.toLocaleString()}
              </td>

              <td className="px-3 py-5">
                {formatMoney(row.totalDonation, currency)}
              </td>

              <td className="px-3 py-5">
                {formatMoney(row.netDonation, currency)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</CardBox>
      </div>;
}
