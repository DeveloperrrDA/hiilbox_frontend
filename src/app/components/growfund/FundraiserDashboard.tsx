"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import SimpleBar from "simplebar-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

const datePresets = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This month",
  "Last month",
  "This year",
  "Last year",
  "All time"
];

const toLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const getDates = (preset: string) => {
  const today = new Date();
  let start = new Date();
  let end = new Date();

  switch (preset) {
    case "Today":
      break;
    case "Yesterday":
      start.setDate(today.getDate() - 1);
      end.setDate(today.getDate() - 1);
      break;
    case "Last 7 days":
      start.setDate(today.getDate() - 6);
      break;
    case "Last 30 days":
      start.setDate(today.getDate() - 29);
      break;
    case "Last 90 days":
      start.setDate(today.getDate() - 89);
      break;
    case "This month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "Last month":
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "This year":
      start = new Date(today.getFullYear(), 0, 1);
      break;
    case "Last year":
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear() - 1, 11, 31);
      break;
    case "All time":
    default:
      start = new Date("2020-01-01");
      break;
  }

  return { start: toLocalISOString(start), end: toLocalISOString(end) };
};

export default function FundraiserDashboard() {
  const [dateRange, setDateRange] = useState({ label: "This year", ...getDates("This year") });
  const [customDate, setCustomDate] = useState({ start: "", end: "" });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [user, setUser] = useState<User>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [donationsChart, setDonationsChart] = useState({ categories: [] as string[], data: [] as number[], total: 0 });
  const [statsCharts, setStatsCharts] = useState({ raised: [] as number[], donations: [] as number[], progress: [] as number[] });

  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    const saved = localStorage.getItem("auth_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
    
    if (!token) {
      setError("Please sign in to view your fundraiser dashboard.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    const getDynamicBuckets = (startDate: string, endDate: string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      let actualStart = new Date(start);
      let actualEnd = new Date(end);
      
      if (diffDays === 0) {
        actualStart.setDate(start.getDate() - 5);
        actualEnd.setDate(start.getDate() + 6);
      } else if (diffDays <= 12) {
        const pad = 12 - diffDays;
        const padStart = Math.floor(pad / 2);
        const padEnd = pad - padStart;
        actualStart.setDate(start.getDate() - padStart);
        actualEnd.setDate(end.getDate() + padEnd);
      }
      
      const adjustedDiff = Math.round((actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24));
      const buckets = [];
      
      if (adjustedDiff <= 12) {
        for(let d = new Date(actualStart); d <= actualEnd; d.setDate(d.getDate() + 1)) {
          const lbl = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          buckets.push({ label: lbl, startMs: new Date(d).setHours(0,0,0,0), endMs: new Date(d).setHours(23,59,59,999) });
        }
      } else if (adjustedDiff <= 35) {
        const chunkSize = Math.ceil(adjustedDiff / 12);
        for(let d = new Date(actualStart); d <= actualEnd; d.setDate(d.getDate() + chunkSize)) {
          const chunkEnd = new Date(d);
          chunkEnd.setDate(chunkEnd.getDate() + chunkSize - 1);
          if (chunkEnd > actualEnd) chunkEnd.setTime(actualEnd.getTime());
          
          const l1 = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const l2 = chunkEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          let lbl = l1;
          if (l1 !== l2) {
            const m1 = l1.split(' ')[0];
            const m2 = l2.split(' ')[0];
            lbl = m1 === m2 ? `${l1} - ${l2.split(' ')[1]}` : `${l1} - ${l2}`;
          }
          buckets.push({ label: lbl, startMs: new Date(d).setHours(0,0,0,0), endMs: new Date(chunkEnd).setHours(23,59,59,999) });
        }
      } else if (adjustedDiff <= 95) {
        const chunkSize = Math.ceil(adjustedDiff / 12);
        for(let d = new Date(actualStart); d <= actualEnd; d.setDate(d.getDate() + chunkSize)) {
          const chunkEnd = new Date(d);
          chunkEnd.setDate(chunkEnd.getDate() + chunkSize - 1);
          if (chunkEnd > actualEnd) chunkEnd.setTime(actualEnd.getTime());
          
          const l1 = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const l2 = chunkEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          buckets.push({ label: `${l1} - ${l2}`, startMs: new Date(d).setHours(0,0,0,0), endMs: new Date(chunkEnd).setHours(23,59,59,999) });
        }
      } else if (adjustedDiff <= 366) {
        let currentMonth = new Date(actualStart.getFullYear(), actualStart.getMonth(), 1);
        while(currentMonth <= actualEnd) {
          const lbl = currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
          buckets.push({ label: lbl, startMs: currentMonth.getTime(), endMs: nextMonth.getTime() - 1 });
          currentMonth = nextMonth;
        }
      } else {
        let y = actualStart.getFullYear();
        let q = Math.floor(actualStart.getMonth() / 3) + 1;
        const endY = actualEnd.getFullYear();
        const endQ = Math.floor(actualEnd.getMonth() / 3) + 1;
        
        while(y < endY || (y === endY && q <= endQ)) {
          const lbl = `Q${q} ${y}`;
          const startMs = new Date(y, (q-1)*3, 1).getTime();
          const endMs = new Date(y, q*3, 0, 23, 59, 59, 999).getTime();
          buckets.push({ label: lbl, startMs, endMs });
          q++;
          if (q > 4) { q = 1; y++; }
        }
      }
      return buckets;
    };

    const chartBuckets = getDynamicBuckets(dateRange.start, dateRange.end);
    if (chartBuckets.length === 0) chartBuckets.push({ label: "Data", startMs: 0, endMs: Infinity });

    const getBucketLabel = (dateStr: string) => {
      if (!dateStr) return null;
      const t = new Date(dateStr).getTime();
      const b = chartBuckets.find(b => t >= b.startMs && t <= b.endMs);
      return b ? b.label : null;
    };

    const exactStartMs = new Date(dateRange.start).getTime();
    const exactEndMs = new Date(dateRange.end).setHours(23,59,59,999);

    const inRange = (dateStr: string) => {
      if (!dateStr) return false;
      const t = new Date(dateStr).getTime();
      return t >= exactStartMs && t <= exactEndMs;
    };

    Promise.all([
      fetch(`/api/dashboard/campaigns`, { headers, cache: "no-store" }),
      fetch("/api/dashboard/me", { headers, cache: "no-store" }),
    ])
      .then(async ([campaignResponse, meResponse]) => {
        const [campaignJson, meJson] = await Promise.all([campaignResponse.json(), meResponse.json()]);
        
        if (!campaignResponse.ok) throw new Error(campaignJson?.message || "Unable to load dashboard campaigns.");
        
        // Strictly typed campaign filtering
        const allCampaigns = Array.isArray(campaignJson?.data) ? campaignJson.data : [];
        const filteredCampaigns = allCampaigns.filter((c: Campaign) => inRange(c.start_date || c.created_at));
        setCampaigns(filteredCampaigns);

        // Calculate Donations Line Chart Data & Top Cards Sparklines
        const donationsByBucket: Record<string, number> = {};
        const donationsCountByBucket: Record<string, number> = {};
        const goalByBucket: Record<string, number> = {};
        let totalDonationsAmount = 0;

        filteredCampaigns.forEach((c: Campaign) => {
          const amt = raised(c);
          const count = donations(c);
          const g = goal(c);
          
          const t = new Date(c.start_date || c.created_at).getTime();
          const lbl = getBucketLabel(c.start_date || c.created_at);
          
          if (lbl) {
            donationsByBucket[lbl] = (donationsByBucket[lbl] || 0) + amt;
            donationsCountByBucket[lbl] = (donationsCountByBucket[lbl] || 0) + count;
            goalByBucket[lbl] = (goalByBucket[lbl] || 0) + g;
            
            if (t >= exactStartMs && t <= exactEndMs) {
              totalDonationsAmount += amt;
            }
          }
        });

        const allLabels = chartBuckets.map(b => b.label);
        const overallDonationsData = allLabels.map(lbl => Number((donationsByBucket[lbl] || 0).toFixed(2)));
        const overallDonationsCountData = allLabels.map(lbl => donationsCountByBucket[lbl] || 0);
        const overallProgressData = allLabels.map(lbl => {
            const r = donationsByBucket[lbl] || 0;
            const g = goalByBucket[lbl] || 0;
            return g > 0 ? Number(((r / g) * 100).toFixed(1)) : 0;
        });

        setDonationsChart({ categories: allLabels, data: overallDonationsData, total: totalDonationsAmount });
        setStatsCharts({
          raised: overallDonationsData,
          donations: overallDonationsCountData,
          progress: overallProgressData
        });

        if (meResponse.ok && meJson?.data) {
          setUser(meJson.data);
          let previous: any = {};
          try { previous = JSON.parse(localStorage.getItem("auth_user") || "{}"); } catch {}
          localStorage.setItem("auth_user", JSON.stringify({ ...previous, ...meJson.data, roles: meJson.data?.roles?.length ? meJson.data.roles : previous?.roles }));
          window.dispatchEvent(new Event("hiilbox-auth-changed"));
        }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load dashboard."))
      .finally(() => setLoading(false));
  }, [dateRange]);

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
    colors: ["#01A14B"],
  };

  return (
    <div className="space-y-7 bg-[#f1f2f5] dark:bg-[#121621] min-h-screen pb-10">
      
      {/* Modern Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] uppercase">
            — FUNDRAISER PORTAL
          </span>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
            Welcome back, {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your campaign snapshot, recent donations, and progress.
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Date Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full bg-white dark:bg-dark text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm text-sm h-10 px-5 transition-colors">
                <Icon icon="solar:calendar-line-duotone" className="mr-2 text-primary" height={18}/>
                Date: {dateRange.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] bg-white dark:bg-dark border border-gray-100 dark:border-gray-800 p-2 shadow-lg rounded-xl">
              <div className="max-h-60 overflow-y-auto">
                {datePresets.map((preset) => (
                  <DropdownMenuItem 
                    key={preset} 
                    onClick={() => setDateRange({ label: preset, ...getDates(preset) })}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm mb-1 transition-colors ${
                      dateRange.label === preset 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {preset}
                  </DropdownMenuItem>
                ))}
              </div>
              
              <div className="px-3 py-3 mt-1 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Custom Range</p>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
                    value={customDate.start}
                    onChange={(e) => setCustomDate(prev => ({ ...prev, start: e.target.value }))}
                  />
                  <span className="text-gray-400 text-xs">to</span>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
                    value={customDate.end}
                    onChange={(e) => setCustomDate(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <Button 
                  size="sm" 
                  className="w-full h-8 text-xs bg-[#01A14B] hover:bg-[#018b41] text-white rounded-lg shadow-sm"
                  disabled={!customDate.start || !customDate.end}
                  onClick={() => {
                    if (customDate.start && customDate.end) {
                      setDateRange({ 
                        label: `${customDate.start} to ${customDate.end}`, 
                        start: customDate.start, 
                        end: customDate.end 
                      });
                    }
                  }}
                >
                  Apply Custom Date
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild className="rounded-full bg-[#01A14B] hover:bg-[#018b41] text-white shadow-sm text-sm h-10 px-6">
            <Link href="/create-campaign">
              <Icon icon="solar:add-circle-line-duotone" className="mr-2" height={18}/> New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-error/30 bg-lighterror px-4 py-3 text-sm text-error mb-4">{error}</div>}

      {/* Hero Stats */}
      <div className="grid grid-cols-12 gap-6">
        <CardBox className="relative col-span-12 overflow-hidden bg-primary lg:col-span-4 rounded-2xl shadow-sm border-0 h-full flex flex-col justify-center p-8">
          <div className="relative z-10">
            <h4 className="text-2xl font-bold text-white mb-2">Campaign Impact</h4>
            <p className="text-sm font-medium text-white/90 mb-6">Here is how your overall fundraising efforts are performing.</p>
            <div className="flex w-fit items-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
              <div className="px-6 py-4 text-center">
                <h5 className="text-2xl font-bold text-white">{loading ? "…" : campaigns.length}</h5>
                <small className="block text-xs font-semibold text-white/80 uppercase tracking-wider mt-1">Campaigns</small>
              </div>
              <div className="border-s border-white/20 px-6 py-4 text-center bg-black/5">
                <h5 className="text-2xl font-bold text-white">{loading ? "…" : stats.active}</h5>
                <small className="block text-xs font-semibold text-white/80 uppercase tracking-wider mt-1">Active</small>
              </div>
            </div>
          </div>
          <Image src="/images/backgrounds/make-social-media.png" alt="" width={294} height={206} className="absolute -bottom-10 -end-10 opacity-30 w-fit sm:block pointer-events-none" />
        </CardBox>

        <div className="col-span-12 grid grid-cols-12 gap-6 lg:col-span-8">
          {/* Card 1: Total Raised */}
          <CardBox className="col-span-12 md:col-span-4 border-0 shadow-sm rounded-2xl bg-white dark:bg-dark p-0 overflow-hidden flex flex-col justify-between h-full">
            <div className="flex justify-between p-5 pb-2 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Raised</p>
                <h5 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {loading ? "…" : money(stats.totalRaised, code)}
                </h5>
              </div>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lightsuccess dark:bg-darksuccess text-success`}>
                <Icon icon="solar:wallet-money-line-duotone" height={22} />
              </span>
            </div>
            {!loading && (
              <div className="mt-auto">
                <Chart
                  options={{
                    chart: { type: "area", fontFamily: `inherit`, sparkline: { enabled: true } },
                    colors: ["var(--color-success)"],
                    stroke: { curve: "smooth", width: 2 },
                    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 100] } },
                    tooltip: { theme: "dark", x: { show: true }, y: { title: { formatter: () => "Raised:" } } },
                  }}
                  series={[{ name: "Raised", data: statsCharts.raised }]}
                  type="area" height="70px" width="100%"
                />
              </div>
            )}
          </CardBox>

          {/* Card 2: Donations */}
          <CardBox className="col-span-12 md:col-span-4 border-0 shadow-sm rounded-2xl bg-white dark:bg-dark p-0 overflow-hidden flex flex-col justify-between h-full">
            <div className="flex justify-between p-5 pb-2 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Donations</p>
                <h5 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {loading ? "…" : stats.totalDonations.toLocaleString()}
                </h5>
              </div>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lightinfo dark:bg-darkinfo text-info`}>
                <Icon icon="solar:hand-money-line-duotone" height={22} />
              </span>
            </div>
            {!loading && (
              <div className="mt-auto px-4 pb-2">
                <Chart
                  options={{
                    chart: { type: "bar", fontFamily: `inherit`, sparkline: { enabled: true } },
                    colors: ["var(--color-info)"],
                    plotOptions: { bar: { borderRadius: 3, columnWidth: "50%" } },
                    tooltip: { theme: "dark", x: { show: true }, y: { title: { formatter: () => "Donations:" } } },
                  }}
                  series={[{ name: "Donations", data: statsCharts.donations }]}
                  type="bar" height="60px" width="100%"
                />
              </div>
            )}
          </CardBox>

          {/* Card 3: Goal Progress */}
          <CardBox className="col-span-12 md:col-span-4 border-0 shadow-sm rounded-2xl bg-white dark:bg-dark p-0 overflow-hidden flex flex-col justify-between h-full">
            <div className="flex justify-between p-5 pb-2 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Goal Progress</p>
                <h5 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {loading ? "…" : `${stats.progress.toFixed(1)}%`}
                </h5>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lightwarning dark:bg-darkwarning text-warning">
                <Icon icon="solar:chart-2-line-duotone" height={22} />
              </span>
            </div>
            {!loading && (
              <div className="mt-auto px-5 pb-6">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-xs text-gray-400 font-medium">0%</span>
                   <span className="text-xs text-gray-400 font-medium">100%</span>
                </div>
                <Progress 
                  value={stats.progress} 
                  variant="warning" 
                  className="h-2 bg-gray-100 dark:bg-gray-800" 
                />
              </div>
            )}
          </CardBox>
        </div>
      </div>

      {/* Full Width Donations Line Chart */}
      <CardBox className="border-0 shadow-sm rounded-2xl p-7 mt-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Donations Overview</h4>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
              ${donationsChart.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-sm text-gray-500 mt-1">Total raised across all campaigns over time</span>
          </div>
        </div>
        
        {!loading && (
          <div className="-ml-3">
            <Chart
              options={{
                chart: { fontFamily: `inherit`, foreColor: "#9ca3af", toolbar: { show: false } },
                stroke: { width: 4, curve: "smooth" },
                xaxis: {
                  type: "category",
                  categories: donationsChart.categories, 
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                },
                fill: {
                  type: "gradient",
                  gradient: { shade: "light", type: "vertical", opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] },
                },
                colors: ["#13deb9"],
                markers: { size: 5, strokeColors: "#fff", strokeWidth: 2, hover: { size: 7 } },
                yaxis: { min: 0, labels: { formatter: (value) => `$${value}` } },
                grid: { borderColor: "#f3f4f6", strokeDashArray: 4, yaxis: { lines: { show: true } } },
                tooltip: { theme: "light", y: { formatter: (val) => `$${val}` } },
              }}
              series={[{ name: "Raised", data: donationsChart.data }]} 
              type="area"
              height="320px"
              width="100%"
            />
          </div>
        )}
      </CardBox>

      {/* Mid Section Charts */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <CardBox className="col-span-12 lg:col-span-8 border-0 shadow-sm rounded-2xl p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-xl font-bold text-gray-900 dark:text-white">Funding by campaign</h5>
              <p className="mt-1 text-sm text-gray-500">Real raised totals from your top active campaigns.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full h-9">
              <Link href="/dashboard/campaigns">View All</Link>
            </Button>
          </div>
          {topCampaigns.length ? (
            <Chart options={fundingOptions} series={[{ name: "Raised", data: topCampaigns.map(raised) }]} type="bar" height={Math.max(280, topCampaigns.length * 48)} />
          ) : (
            <p className="py-14 text-center text-sm text-gray-500">No campaign data yet.</p>
          )}
        </CardBox>

        <CardBox className="col-span-12 lg:col-span-4 border-0 shadow-sm rounded-2xl p-7 flex flex-col justify-between">
          <div>
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">Overall progress</h5>
            <p className="mt-1 text-sm text-gray-500">Raised vs Total Goal across all campaigns.</p>
          </div>
          <div className="my-6">
            <Chart options={progressOptions} series={[Number(stats.progress.toFixed(1))]} type="radialBar" height={280} />
          </div>
          <div className="mt-auto space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Total Raised</span>
              <strong className="text-gray-900 dark:text-white text-base">{money(stats.totalRaised, code)}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Combined Goal</span>
              <strong className="text-gray-900 dark:text-white text-base">{money(stats.totalGoal, code)}</strong>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Bottom Section - Status & Top Campaigns Table */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <CardBox className="col-span-12 lg:col-span-4 border-0 shadow-sm rounded-2xl p-7">
          <h5 className="text-xl font-bold text-gray-900 dark:text-white">Campaign status</h5>
          <p className="mt-1 text-sm text-gray-500 mb-6">Current lifecycle distribution.</p>
          {statusCounts.length ? (
            <Chart options={statusOptions} series={statusCounts.map(([, count]) => count)} type="donut" height={320} />
          ) : (
            <p className="py-14 text-center text-sm text-gray-500">No status data yet.</p>
          )}
        </CardBox>
        
        <CardBox className="col-span-12 lg:col-span-8 p-0 border-0 shadow-sm rounded-2xl h-full flex flex-col overflow-hidden">
          <div className="p-7 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h5 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Performance</h5>
              <p className="text-sm text-gray-500 mt-1">Raised, goal and donation totals.</p>
            </div>
          </div>
          
          <SimpleBar className="max-h-[450px] flex-grow">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableRow className="border-b-0">
                    <TableHead className="py-4 px-7 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</TableHead>
                    <TableHead className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal Progress</TableHead>
                    <TableHead className="py-4 px-7 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-500">Loading campaigns...</TableCell></TableRow>
                  ) : topCampaigns.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-500">No campaigns found.</TableCell></TableRow>
                  ) : (
                    topCampaigns.map((c, index) => {
                      const r = raised(c);
                      const g = goal(c);
                      const p = g > 0 ? Math.min((r / g) * 100, 100) : 0;
                      const isFunded = r >= g && g > 0;
                      
                      const status = String(c.status || "unknown");
                      const statusColor = status === "published" ? "lightSuccess" : status === "draft" ? "lightSecondary" : "lightWarning";
                      const progressColor = isFunded ? "success" : "primary";
                      const imgUrl = c.images?.[0]?.sizes?.thumbnail?.url || "";

                      return (
                        <TableRow key={c.id || index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors border-0">
                          <TableCell className="px-7 py-4">
                            <div className="flex gap-4 items-center">
                              {imgUrl ? (
                                <Image src={imgUrl} alt="campaign" className="h-12 w-12 rounded-xl object-cover shadow-sm" width={48} height={48} />
                              ) : (
                                <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                  <Icon icon="solar:gallery-bold" className="text-gray-400 text-xl" />
                                </div>
                              )}
                              <div className="truncate max-w-[240px]">
                                <Link href={`/dashboard/campaigns/${c.id}`} className="hover:text-primary transition-colors">
                                  <h6 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.title || `Campaign #${c.id}`}</h6>
                                </Link>
                                <p className="text-xs text-gray-500 mt-1">{donations(c).toLocaleString()} donations</p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="px-4 py-4 min-w-[200px]">
                            <div className="flex justify-between items-end mb-2">
                              <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                                {money(r, code)}
                              </h5>
                              {c.has_goal && g > 0 && (
                                <span className="text-xs text-gray-500">
                                  of {money(g, code)}
                                </span>
                              )}
                            </div>
                            <Progress value={c.has_goal && g > 0 ? p : 100} variant={progressColor as any} className="h-1.5" />
                          </TableCell>

                          <TableCell className="px-7 py-4 text-right">
                            <Badge variant={statusColor as any} className="capitalize rounded-full px-3 py-1 font-medium shadow-sm">
                              {status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </SimpleBar>
        </CardBox>
      </div>
    </div>
  );
}