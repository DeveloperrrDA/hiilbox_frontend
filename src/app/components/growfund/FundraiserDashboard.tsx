"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Campaign = Record<string, any>;
type User = { first_name?: string; last_name?: string; display_name?: string; username?: string; email?: string };

function n(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function raised(c: Campaign) { return n(c?.raised_amount ?? c?.fund_raised ?? c?.amount_raised); }
function goal(c: Campaign) { return n(c?.goal_amount ?? c?.goal); }
function donations(c: Campaign) { return n(c?.number_of_contributions ?? c?.donation_count ?? c?.donations); }
function currency(campaigns: Campaign[]) {
  return String(campaigns.find((c) => c?.currency || c?.currency_code)?.currency ?? campaigns.find((c) => c?.currency_code)?.currency_code ?? "USD").toUpperCase();
}
function money(value: number, code: string) {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: 0 }).format(value); }
  catch { return `${code} ${value.toLocaleString()}`; }
}

export default function FundraiserDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [user, setUser] = useState<User>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    const saved = localStorage.getItem("auth_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
    if (!token) {
      setError("Please sign in to view your fundraiser dashboard.");
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/dashboard/campaigns", { headers, cache: "no-store" }),
      fetch("/api/dashboard/me", { headers, cache: "no-store" }),
    ])
      .then(async ([campaignResponse, meResponse]) => {
        const [campaignJson, meJson] = await Promise.all([campaignResponse.json(), meResponse.json()]);
        if (!campaignResponse.ok) throw new Error(campaignJson?.message || "Unable to load dashboard campaigns.");
        setCampaigns(Array.isArray(campaignJson?.data) ? campaignJson.data : []);
        if (meResponse.ok && meJson?.data) {
          setUser(meJson.data);
          localStorage.setItem("auth_user", JSON.stringify(meJson.data));
        }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalRaised = campaigns.reduce((sum, c) => sum + raised(c), 0);
    const totalGoal = campaigns.reduce((sum, c) => sum + goal(c), 0);
    const totalDonations = campaigns.reduce((sum, c) => sum + donations(c), 0);
    const active = campaigns.filter((c) => ["published", "active", "funded"].includes(String(c?.status ?? "").toLowerCase()) && !c?.is_ended).length;
    const progress = totalGoal > 0 ? Math.min(100, totalRaised / totalGoal * 100) : 0;
    return { totalRaised, totalGoal, totalDonations, active, progress };
  }, [campaigns]);

  const code = currency(campaigns);
  const name = user.first_name?.trim() || user.display_name?.trim() || user.username?.trim() || "Fundraiser";
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    campaigns.forEach((c) => {
      const key = String(c?.status || "unknown").toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [campaigns]);
  const topCampaigns = useMemo(() => [...campaigns].sort((a, b) => raised(b) - raised(a)).slice(0, 8), [campaigns]);

  const fundingOptions: any = {
    chart: { toolbar: { show: false }, fontFamily: "inherit" },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: "55%" } },
    xaxis: { categories: topCampaigns.map((c) => String(c?.title || `Campaign ${c?.id}`)), labels: { formatter: (v: number) => new Intl.NumberFormat(undefined, { notation: "compact" }).format(v) } },
    grid: { borderColor: "rgba(0,0,0,.08)", strokeDashArray: 3 },
    colors: ["var(--color-primary)"],
    tooltip: { y: { formatter: (v: number) => money(v, code) } },
  };
  const statusOptions: any = {
    labels: statusCounts.map(([status]) => status.replaceAll("_", " ")),
    chart: { fontFamily: "inherit" },
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    stroke: { width: 2 },
  };
  const progressOptions: any = {
    chart: { fontFamily: "inherit" },
    plotOptions: { radialBar: { hollow: { size: "68%" }, dataLabels: { name: { show: true, offsetY: 20 }, value: { fontSize: "26px", fontWeight: 700, offsetY: -18, formatter: (v: number) => `${Math.round(v)}%` } } } },
    labels: ["Funded"],
    colors: ["var(--color-primary)"],
  };

  return (
    <div className="space-y-7">
      {error && <div className="rounded-lg border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}

      <div className="grid grid-cols-12 gap-7">
        <CardBox className="relative col-span-12 overflow-hidden bg-primary lg:col-span-6">
          <div className="relative z-10 md:w-3/5">
            <h4 className="text-xl text-white">Welcome {name}</h4>
            <p className="mt-1 text-sm font-medium text-white/90">Here is how your fundraising is performing.</p>
            <div className="mt-5 flex w-fit items-center rounded-full bg-gray-800/10">
              <div className="px-6 py-3 text-center"><h5 className="text-lg text-white">{loading ? "…" : campaigns.length}</h5><small className="block text-xs font-medium text-white">Campaigns</small></div>
              <div className="border-s border-white/20 px-6 py-3 text-center"><h5 className="text-lg text-white">{loading ? "…" : stats.active}</h5><small className="block text-xs font-medium text-white">Active</small></div>
            </div>
          </div>
          <Image src="/images/backgrounds/make-social-media.png" alt="" width={294} height={206} className="absolute -top-7 end-0 hidden w-fit sm:block" />
        </CardBox>

        <div className="col-span-12 grid grid-cols-12 gap-7 lg:col-span-6">
          {[
            ["Total raised", money(stats.totalRaised, code), "solar:wallet-money-line-duotone", "primary"],
            ["Donations", stats.totalDonations.toLocaleString(), "solar:hand-money-line-duotone", "success"],
            ["Goal progress", `${stats.progress.toFixed(1)}%`, "solar:chart-2-line-duotone", "secondary"],
          ].map(([label, value, icon]) => (
            <CardBox key={String(label)} className="col-span-12 md:col-span-4 !shadow-none">
              <span className="mb-5 flex h-10 w-14 items-center justify-center rounded-full bg-lightprimary text-primary"><Icon icon={String(icon)} height={23} /></span>
              <h5 className="text-lg">{loading ? "…" : value}</h5><p className="mt-2 text-sm font-medium text-darklink">{label}</p>
            </CardBox>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-7">
        <CardBox className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between gap-4"><div><h5 className="card-title">Funding by campaign</h5><p className="mt-1 text-sm text-darklink">Real raised totals from your GrowFund campaigns.</p></div><Button asChild variant="outline"><Link href="/dashboard/campaigns">My campaigns</Link></Button></div>
          {topCampaigns.length ? <Chart options={fundingOptions} series={[{ name: "Raised", data: topCampaigns.map(raised) }]} type="bar" height={Math.max(280, topCampaigns.length * 48)} /> : <p className="py-14 text-center text-sm text-darklink">No campaign data yet.</p>}
        </CardBox>
        <CardBox className="col-span-12 lg:col-span-4">
          <h5 className="card-title">Overall progress</h5><p className="mt-1 text-sm text-darklink">Raised across all campaign goals.</p>
          <Chart options={progressOptions} series={[Number(stats.progress.toFixed(1))]} type="radialBar" height={280} />
          <div className="flex justify-between border-t border-ld pt-4 text-sm"><span className="text-darklink">Raised</span><strong>{money(stats.totalRaised, code)}</strong></div>
          <div className="mt-3 flex justify-between text-sm"><span className="text-darklink">Combined goal</span><strong>{money(stats.totalGoal, code)}</strong></div>
        </CardBox>
      </div>

      <div className="grid grid-cols-12 gap-7">
        <CardBox className="col-span-12 lg:col-span-5"><h5 className="card-title">Campaign status</h5><p className="mt-1 text-sm text-darklink">Current lifecycle distribution.</p>{statusCounts.length ? <Chart options={statusOptions} series={statusCounts.map(([, count]) => count)} type="donut" height={320} /> : <p className="py-14 text-center text-sm text-darklink">No campaign status data yet.</p>}</CardBox>
        <CardBox className="col-span-12 lg:col-span-7">
          <div className="flex items-center justify-between"><div><h5 className="card-title">Campaign performance</h5><p className="mt-1 text-sm text-darklink">Raised, goal and donation totals.</p></div><Button asChild><Link href="/create-campaign"><Icon icon="solar:add-circle-line-duotone" /> Create campaign</Link></Button></div>
          <div className="mt-5 divide-y divide-ld">{topCampaigns.slice(0, 5).map((c) => { const p = goal(c) > 0 ? Math.min(100, raised(c) / goal(c) * 100) : 0; return <Link key={c.id} href={`/dashboard/campaigns/${c.id}/overview`} className="block py-4 transition hover:bg-lightgray/40"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><p className="truncate font-semibold">{c.title || `Campaign #${c.id}`}</p><p className="mt-1 text-xs text-darklink">{donations(c).toLocaleString()} donations · {String(c.status || "unknown")}</p></div><strong className="shrink-0">{money(raised(c), code)}</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-lightgray"><div className="h-full rounded-full bg-primary" style={{ width: `${p}%` }} /></div></Link>; })}{!topCampaigns.length && <p className="py-14 text-center text-sm text-darklink">No campaigns yet.</p>}</div>
        </CardBox>
      </div>
    </div>
  );
}
