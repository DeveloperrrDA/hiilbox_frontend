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

type AnyRecord = Record<string, any>;

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

function toPrimitiveMetrics(input: AnyRecord) {
  const hidden = new Set(["id", "campaign_id", "title", "name", "currency", "start_date", "end_date"]);
  return Object.entries(input)
    .filter(([key, value]) => !hidden.has(key) && ["string", "number", "boolean"].includes(typeof value))
    .slice(0, 12);
}

export default function CampaignOverview({ id }: { id: string }) {
  const [updatedNotice, setUpdatedNotice] = useState(false);
  const [data, setData] = useState<AnyRecord>({});
  const [campaign, setCampaign] = useState<AnyRecord>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>("this_year");

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
      const [overviewResponse, campaignResponse] = await Promise.all([
        fetch(`/api/dashboard/campaigns/${id}/overview?${qs.toString()}`, { headers, cache: "no-store" }),
        fetch(`/api/dashboard/campaigns/${id}`, { headers, cache: "no-store" }),
      ]);
      const [overviewJson, campaignJson] = await Promise.all([overviewResponse.json(), campaignResponse.json()]);
      if (!overviewResponse.ok) throw new Error(overviewJson?.message || "Unable to load campaign overview.");
      if (!campaignResponse.ok) throw new Error(campaignJson?.message || "Unable to load campaign details.");
      setData(overviewJson?.data ?? {});
      setCampaign(campaignJson?.data ?? {});
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
  const raised = numberFrom(data, ["raised_amount", "fund_raised", "total_raised", "raised", "amount_raised"]);
  const donations = numberFrom(data, ["donations", "donation_count", "total_donations", "number_of_donations", "contributions", "contribution_count"]);
  const contributors = numberFrom(data, ["contributors", "number_of_contributors", "donors", "donor_count", "unique_donors"]);
  const views = numberFrom(data, ["views", "view_count", "total_views", "visits"]);
  const averageDonation = numberFrom(data, ["average_donation", "average_donation_amount", "avg_donation"] ) || (donations > 0 ? raised / donations : 0);
  const goal = Number(campaign.goal_amount ?? campaign.goal ?? 0) || numberFrom(data, ["goal_amount", "goal"]);
  const progress = goal > 0 ? Math.min(100, Math.max(0, raised / goal * 100)) : 0;
  const rangeStart = textFrom(data, ["start_date", "from_date"]);
  const rangeEnd = textFrom(data, ["end_date", "to_date"]);
  const primitiveMetrics = useMemo(() => toPrimitiveMetrics(data), [data]);

  const stats = [
    ["Raised", formatMoney(raised, currency), "solar:wallet-money-line-duotone"],
    ["Donations", donations.toLocaleString(), "solar:hand-money-line-duotone"],
    ["Contributors", contributors.toLocaleString(), "solar:users-group-rounded-line-duotone"],
    ["Average donation", formatMoney(averageDonation, currency), "solar:chart-square-line-duotone"],
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

    <div className="grid grid-cols-12 gap-6">
      <CardBox className="col-span-12 lg:col-span-5">
        <div><h5 className="card-title">Funding progress</h5><p className="mt-1 text-sm text-darklink">Campaign total compared with its target.</p></div>
        <Chart
          type="radialBar"
          height={300}
          series={[Number(progress.toFixed(1))]}
          options={{
            chart: { fontFamily: "inherit" },
            colors: ["var(--color-primary)"],
            labels: ["Funded"],
            plotOptions: { radialBar: { hollow: { size: "68%" }, dataLabels: { name: { show: true, offsetY: 22 }, value: { fontSize: "28px", fontWeight: 700, offsetY: -18, formatter: (value: number) => `${Math.round(value)}%` } } } },
          } as any}
        />
        <div className="flex justify-between border-t border-ld pt-4 text-sm"><span className="text-darklink">Raised</span><strong>{formatMoney(raised, currency)}</strong></div>
        <div className="mt-3 flex justify-between text-sm"><span className="text-darklink">Goal</span><strong>{formatMoney(goal, currency)}</strong></div>
      </CardBox>
      <CardBox className="col-span-12 lg:col-span-7">
        <div><h5 className="card-title">Engagement</h5><p className="mt-1 text-sm text-darklink">Real GrowFund engagement metrics for the selected period.</p></div>
        <Chart
          type="bar"
          height={300}
          series={[{ name: "Count", data: [donations, contributors, views] }]}
          options={{
            chart: { toolbar: { show: false }, fontFamily: "inherit" },
            colors: ["var(--color-primary)"],
            dataLabels: { enabled: false },
            plotOptions: { bar: { borderRadius: 7, columnWidth: "45%" } },
            xaxis: { categories: ["Donations", "Contributors", "Views"] },
            yaxis: { min: 0, forceNiceScale: true },
            grid: { borderColor: "rgba(0,0,0,.08)", strokeDashArray: 3 },
          } as any}
        />
        <div className="flex items-center justify-between border-t border-ld pt-4"><span className="text-sm text-darklink">Donation conversion from views</span><strong>{loading ? "…" : views > 0 ? `${(donations / views * 100).toFixed(1)}%` : "—"}</strong></div>
      </CardBox>
    </div>

    {primitiveMetrics.length > 0 && <CardBox>
      <h5 className="card-title">Additional GrowFund metrics</h5>
      <p className="mt-1 text-sm text-darklink">Additional scalar values returned by the overview service.</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {primitiveMetrics.map(([key, value]) => <div key={key} className="rounded-md border border-ld px-4 py-3"><p className="text-xs uppercase tracking-wide text-darklink">{key.replaceAll("_", " ")}</p><p className="mt-1 font-medium">{typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}</p></div>)}
      </div>
    </CardBox>}
  </div>;
}
