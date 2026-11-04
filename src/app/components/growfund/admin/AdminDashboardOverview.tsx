"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { adminApi, rowsFrom } from "./adminApi";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const GATEWAY_MAP: Record<string, { name: string; color: string; hex: string; icon: string }> = {
  zes_pay: { name: "Waafi", color: "primary", hex: "#01A14B", icon: "solar:wallet-2-line-duotone" },
  bacs: { name: "Bank / Offline", color: "warning", hex: "#f5b225", icon: "solar:banknote-2-line-duotone" },
  edahab_pay: { name: "eDahab", color: "success", hex: "#13deb9", icon: "solar:card-send-line-duotone" },
  card_pay: { name: "Credit / Debit Card", color: "error", hex: "#fa896b", icon: "solar:card-line-duotone" },
  premier_wallet_pay: { name: "Premier Wallet", color: "info", hex: "#539bff", icon: "solar:safe-2-line-duotone" },
};

const AVATAR_COLORS = ["primary", "secondary", "success", "error", "warning", "info"];

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

export default function AdminDashboardOverview() {
  const [dateRange, setDateRange] = useState({ label: "This year", ...getDates("This year") });
  const [customDate, setCustomDate] = useState({ start: "", end: "" });

  const [stats, setStats] = useState({
    campaigns: { total: 0, chartData: [] as { x: string; y: number }[] },
    donations: { total: 0, chartData: [] as { x: string; y: number }[] },
    donors: { total: 0, chartData: [] as { x: string; y: number }[] },
    fundraisers: { total: 0, chartData: [] as { x: string; y: number }[] },
  });
  
  const [revenueChart, setRevenueChart] = useState({ categories: [] as string[], data: [] as number[], total: 0 });
  const [overallDonationsChart, setOverallDonationsChart] = useState({ categories: [] as string[], data: [] as number[], total: 0 });
  const [gatewayChart, setGatewayChart] = useState({
    total: 0, categories: [] as string[], series: [] as { name: string; data: number[] }[], colors: [] as string[],
    totals: [] as { name: string; amount: number; color: string; icon: string }[],
  });
  const [revenueUpdatesChart, setRevenueUpdatesChart] = useState({
    categories: [] as string[], netDonations: [] as number[], revenue: [] as number[], totalNet: 0, totalRev: 0,
  });

  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [topCampaignsTotals, setTopCampaignsTotals] = useState({ count: 0, totalRaised: 0 });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Revenue");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
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

        const fetchStart = toLocalISOString(new Date(chartBuckets[0].startMs));
        const fetchEnd = toLocalISOString(new Date(chartBuckets[chartBuckets.length - 1].endMs));
        
        const exactStartMs = new Date(dateRange.start).getTime();
        const exactEndMs = new Date(dateRange.end).setHours(23,59,59,999);

        const getBucketLabel = (dateStr: string) => {
          if (!dateStr) return null;
          const t = new Date(dateStr).getTime();
          const b = chartBuckets.find(b => t >= b.startMs && t <= b.endMs);
          return b ? b.label : null;
        };

        const fetchAllPages = async (baseEndpoint: string) => {
          const perPage = 100;
          const sep1 = baseEndpoint.includes("?") ? "&" : "?";
          const endpointWithDates = `${baseEndpoint}${sep1}start_date=${fetchStart}&end_date=${fetchEnd}`;
          
          const firstPage = await adminApi(`${endpointWithDates}&page=1&per_page=${perPage}`);
          const apiTotal = Number(firstPage?.paginated?.total ?? firstPage?.data?.total ?? firstPage?.data?.data?.total ?? firstPage?.total);
          let rows = rowsFrom(firstPage);
          const total = Number.isFinite(apiTotal) && apiTotal >= 0 ? apiTotal : rows.length;
          const totalPages = Math.ceil(total / perPage);
          
          if (totalPages > 1) {
            const promises = [];
            for (let i = 2; i <= totalPages; i++) {
              promises.push(adminApi(`${endpointWithDates}&page=${i}&per_page=${perPage}`));
            }
            const subsequentPages = await Promise.all(promises);
            subsequentPages.forEach((pageRes) => { rows = rows.concat(rowsFrom(pageRes)); });
          }
          return { total, rows };
        };

        const fetchAnalytics = adminApi(`analytics?start_date=${dateRange.start}&end_date=${dateRange.end}&type=top-campaigns`);
        const fetchRecentDonations = adminApi(`analytics?start_date=${dateRange.start}&end_date=${dateRange.end}&type=recent-contributions`);

        const [cRes, dRes, doaRes, fRes, analyticsRes, recentRes] = await Promise.allSettled([
          fetchAllPages("campaigns?status=all"),
          fetchAllPages("donations/paginated"),
          fetchAllPages("donors/paginated"),
          fetchAllPages("fundraisers/paginated"),
          fetchAnalytics,
          fetchRecentDonations,
        ]);

        const processData = (res: PromiseSettledResult<any>, dateKey: string) => {
          if (res.status !== "fulfilled") return { total: 0, chartData: [] };
          const { rows } = res.value;

          const groupedByBucket = rows.reduce((acc: Record<string, number>, item: any) => {
            const lbl = getBucketLabel(item[dateKey]);
            if (lbl) acc[lbl] = (acc[lbl] || 0) + 1;
            return acc;
          }, {});

          const chartData = chartBuckets.map(b => ({
            x: b.label,
            y: groupedByBucket[b.label] || 0
          }));

          const exactTotal = rows.filter((item: any) => {
            const t = new Date(item[dateKey]).getTime();
            return t >= exactStartMs && t <= exactEndMs;
          }).length;

          return { total: exactTotal, chartData };
        };

        if (analyticsRes.status === "fulfilled" && analyticsRes.value?.data) {
          const cData = analyticsRes.value.data;
          setTopCampaigns(cData);
          const tRaised = cData.reduce((acc: number, curr: any) => acc + (Number(curr.fund_raised) || 0), 0);
          setTopCampaignsTotals({ count: cData.length, totalRaised: tRaised });
        }

        if (recentRes.status === "fulfilled" && recentRes.value?.data) {
          setRecentDonations(recentRes.value.data.slice(0, 5));
        }

        if (dRes.status === "fulfilled") {
          const donationRows = dRes.value.rows;
          const completedDonations = donationRows.filter((item: any) => {
            const status = String(item.status || "").toLowerCase();
            const paymentStatus = String(item.payment_status || "").toLowerCase();
            return status === "completed" || paymentStatus === "completed";
          });

          const revenueByBucket: Record<string, number> = {};
          const grossDonationsByBucket: Record<string, number> = {};
          const gQuarterly: Record<string, Record<string, number>> = {};
          const netDonationsByBucket: Record<string, number> = {};
          const revUpdatesByBucket: Record<string, number> = {};
          
          const gTotals: Record<string, number> = {};
          let aggregateNetDonations = 0;
          let aggregateRevenue = 0;
          let aggregateGrossDonations = 0;
          let totalGatewayDonations = 0;

          completedDonations.forEach((item: any) => {
            const amount = parseFloat(item.amount) || 0;
            const gatewayFee = Math.abs(parseFloat(item.gateway_fee) || parseFloat(item.processing_fee) || 0);
            const platformFee = Math.abs(parseFloat(item.platform_fee) || 0);
            const tipAmount = Math.abs(parseFloat(item.tip_amount) || parseFloat(item.tip) || 0);

            const netDonation = amount - (gatewayFee + platformFee);
            const revenue = platformFee + tipAmount;

            const t = new Date(item.created_at).getTime();
            const isExact = t >= exactStartMs && t <= exactEndMs;
            const lbl = getBucketLabel(item.created_at);
            
            if (lbl) {
              revenueByBucket[lbl] = (revenueByBucket[lbl] || 0) + revenue;
              grossDonationsByBucket[lbl] = (grossDonationsByBucket[lbl] || 0) + amount;
              netDonationsByBucket[lbl] = (netDonationsByBucket[lbl] || 0) + netDonation;
              revUpdatesByBucket[lbl] = (revUpdatesByBucket[lbl] || 0) + revenue;

              const rawName = item.payment_method?.name || "other";
              const gInfo = GATEWAY_MAP[rawName] || { name: rawName, color: "primary", hex: "#6c757d", icon: "solar:dollar-minimalistic-line-duotone" };
              const gName = gInfo.name;

              if (!gQuarterly[gName]) gQuarterly[gName] = {};
              gQuarterly[gName][lbl] = (gQuarterly[gName][lbl] || 0) + amount;
              
              if (isExact) {
                totalGatewayDonations += amount;
                if (!gTotals[gName]) gTotals[gName] = 0;
                gTotals[gName] += amount;
                aggregateNetDonations += netDonation;
                aggregateRevenue += revenue;
                aggregateGrossDonations += amount;
              }
            }
          });

          const allLabels = chartBuckets.map(b => b.label);

          const overallRevenueData = allLabels.map(lbl => Number((revenueByBucket[lbl] || 0).toFixed(2)));
          setRevenueChart({ categories: allLabels, data: overallRevenueData, total: aggregateRevenue });

          const overallDonationsData = allLabels.map(lbl => Number((grossDonationsByBucket[lbl] || 0).toFixed(2)));
          setOverallDonationsChart({ categories: allLabels, data: overallDonationsData, total: aggregateGrossDonations });

          const sortedGatewayNames = Object.keys(gTotals).sort((a, b) => gTotals[b] - gTotals[a]);
          const gatewaySeries = sortedGatewayNames.map(gName => ({
            name: gName,
            data: allLabels.map(lbl => Number((gQuarterly[gName]?.[lbl] || 0).toFixed(2)))
          }));
          const dynamicColors = sortedGatewayNames.map(gName => {
            const rawKey = Object.keys(GATEWAY_MAP).find(k => GATEWAY_MAP[k].name === gName);
            return rawKey ? GATEWAY_MAP[rawKey].hex : "#6c757d";
          });
          const gatewayIconData = sortedGatewayNames.map(gName => {
            const rawKey = Object.keys(GATEWAY_MAP).find(k => GATEWAY_MAP[k].name === gName);
            const info = rawKey ? GATEWAY_MAP[rawKey] : { color: "primary", hex: "#6c757d", icon: "solar:dollar-minimalistic-line-duotone" };
            return { ...info, name: gName, amount: gTotals[gName] };
          });

          setGatewayChart({
            total: totalGatewayDonations,
            categories: allLabels,
            series: gatewaySeries,
            colors: dynamicColors,
            totals: gatewayIconData,
          });

          const netDonationsData = allLabels.map(lbl => Number((netDonationsByBucket[lbl] || 0).toFixed(2)));
          const revUpdatesData = allLabels.map(lbl => Number((revUpdatesByBucket[lbl] || 0).toFixed(2)));

          setRevenueUpdatesChart({
            categories: allLabels,
            netDonations: netDonationsData,
            revenue: revUpdatesData,
            totalNet: aggregateNetDonations,
            totalRev: aggregateRevenue,
          });
        }

        setStats({
          campaigns: processData(cRes, "start_date"),
          donations: processData(dRes, "created_at"),
          donors: processData(doaRes, "joined_at"),
          fundraisers: processData(fRes, "joined_at"),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load admin overview.");
      } finally {
        setLoading(false);
      }
    })();
  }, [dateRange]); 

  return (
    <div className="space-y-7 bg-[#f1f2f5] dark:bg-[#121621] min-h-screen pb-10">
      
      {/* Modern Header - Extra Margin Bottom */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] uppercase">
            — SYSTEM OVERVIEW
          </span>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
            Welcome back, Administrator
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your operational snapshot, recent activity, and quick actions.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full bg-white dark:bg-dark border-gray-200 dark:border-gray-800 shadow-sm text-sm h-10 px-5">
            <Icon icon="solar:export-line-duotone" className="mr-2" height={18}/> Export
          </Button>

          {/* Date Filter Dropdown with Custom Date Support */}
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
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-error/30 bg-lighterror px-4 py-3 text-sm text-error mb-4">
          {error}
        </div>
      )}

      {/* Stats Grid - Explicitly Styled Cards */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* 1. Campaigns */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardBox className="p-0 overflow-hidden h-full flex flex-col justify-between border-0 shadow-sm rounded-2xl bg-white dark:bg-dark">
            <div className="flex justify-between p-6 pb-2 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Campaigns</p>
                <h5 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {loading ? "…" : stats.campaigns.total.toLocaleString()}
                </h5>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lightprimary dark:bg-darkprimary text-primary">
                <Icon icon="solar:flag-2-line-duotone" height={24} />
              </span>
            </div>
            {!loading && (
              <div className="mt-auto">
                <Chart
                  options={{
                    chart: { type: "area", fontFamily: `inherit`, sparkline: { enabled: true } },
                    colors: ["var(--color-primary)"],
                    stroke: { curve: "smooth", width: 2 },
                    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 100] } },
                    tooltip: { 
                      theme: "dark", 
                      x: { show: true }, 
                      y: { title: { formatter: () => "Campaigns:" } } 
                    },
                  }}
                  series={[{ name: "Campaigns", data: stats.campaigns.chartData }]}
                  type="area" height="80px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>

        {/* 2. Donations */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardBox className="p-0 overflow-hidden h-full flex flex-col justify-between border-0 shadow-sm rounded-2xl bg-[#0b1b2c] dark:bg-[#0b1b2c]">
            <div className="flex justify-between p-6 pb-2 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Donations</p>
                <h5 className="text-3xl font-bold text-white tracking-tight">
                  {loading ? "…" : stats.donations.total.toLocaleString()}
                </h5>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#13deb9]/20 text-[#13deb9]">
                <Icon icon="solar:hand-money-line-duotone" height={24} />
              </span>
            </div>
            {!loading && (
              <div className="mt-auto">
                <Chart
                  options={{
                    chart: { type: "area", fontFamily: `inherit`, sparkline: { enabled: true } },
                    colors: ["#13deb9"],
                    stroke: { curve: "smooth", width: 2 },
                    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.0, stops: [0, 100] } },
                    tooltip: { 
                      theme: "light", 
                      x: { show: true }, 
                      y: { title: { formatter: () => "Donations:" } } 
                    },
                  }}
                  series={[{ name: "Donations", data: stats.donations.chartData }]}
                  type="area" height="80px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>

        {/* 3. Donors */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardBox className="p-0 overflow-hidden h-full flex flex-col justify-between border-0 shadow-sm rounded-2xl bg-white dark:bg-dark">
            <div className="flex justify-between p-6 pb-2 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Donors</p>
                <h5 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {loading ? "…" : stats.donors.total.toLocaleString()}
                </h5>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lightsuccess dark:bg-darksuccess text-success">
                <Icon icon="solar:users-group-rounded-line-duotone" height={24} />
              </span>
            </div>
            {!loading && (
              <div className="mt-auto px-4 pb-2">
                <Chart
                  options={{
                    chart: { type: "bar", fontFamily: `inherit`, sparkline: { enabled: true } },
                    colors: ["var(--color-success)"],
                    plotOptions: { bar: { borderRadius: 3, columnWidth: "50%" } },
                    tooltip: { 
                      theme: "dark", 
                      x: { show: true }, 
                      y: { title: { formatter: () => "Donors:" } } 
                    },
                  }}
                  series={[{ name: "Donors", data: stats.donors.chartData }]}
                  type="bar" height="70px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>

        {/* 4. Fundraisers */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardBox className="p-0 overflow-hidden h-full flex flex-col justify-between border-0 shadow-sm rounded-2xl bg-white dark:bg-dark">
            <div className="flex justify-between p-6 pb-2 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Fundraisers</p>
                <h5 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {loading ? "…" : stats.fundraisers.total.toLocaleString()}
                </h5>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lightinfo dark:bg-darkinfo text-info">
                <Icon icon="solar:user-heart-rounded-line-duotone" height={24} />
              </span>
            </div>
            {!loading && (
              <div className="mt-auto">
                <Chart
                  options={{
                    chart: { type: "area", fontFamily: `inherit`, sparkline: { enabled: true } },
                    colors: ["var(--color-info)"],
                    stroke: { curve: "smooth", width: 2 },
                    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 100] } },
                    tooltip: { 
                      theme: "dark", 
                      x: { show: true }, 
                      y: { title: { formatter: () => "Fundraisers:" } } 
                    },
                  }}
                  series={[{ name: "Fundraisers", data: stats.fundraisers.chartData }]}
                  type="area" height="80px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>
      </div>

      {/* Main Chart Switcher Panel */}
      <CardBox className="border-0 shadow-sm rounded-2xl p-7 mt-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeTab === "Revenue" ? "Revenue Overview" : "Donations Overview"}
            </h4>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
              ${activeTab === "Revenue" ? revenueChart.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : overallDonationsChart.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-sm text-gray-500 mt-1">
              {activeTab === "Revenue" ? "Total platform revenue and tips in period" : "Total gross donations processed in period"}
            </span>
          </div>
          
          <div className="flex flex-wrap bg-muted dark:bg-dark p-1 rounded-full border border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("Revenue")}
              className={`py-2 px-4 rounded-full min-w-[120px] transition-colors text-xs font-semibold text-center ${
                activeTab === "Revenue"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("Donations")}
              className={`py-2 px-4 rounded-full min-w-[120px] transition-colors text-xs font-semibold text-center ${
                activeTab === "Donations"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Donations
            </button>
          </div>
        </div>
        
        {!loading && (
          <div className="-ml-3">
            {activeTab === "Revenue" ? (
              <Chart
                options={{
                  chart: { fontFamily: `inherit`, foreColor: "#9ca3af", toolbar: { show: false } },
                  stroke: { width: 4, curve: "smooth" },
                  xaxis: {
                    type: "category",
                    categories: revenueChart.categories, 
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                  },
                  fill: {
                    type: "gradient",
                    gradient: { shade: "light", type: "vertical", opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] },
                  },
                  colors: ["#01A14B"],
                  markers: { size: 5, strokeColors: "#fff", strokeWidth: 2, hover: { size: 7 } },
                  yaxis: { min: 0, labels: { formatter: (value) => `$${value}` } },
                  grid: { borderColor: "#f3f4f6", strokeDashArray: 4, yaxis: { lines: { show: true } } },
                  tooltip: { theme: "light", y: { formatter: (val) => `$${val}` } },
                }}
                series={[{ name: "Revenue", data: revenueChart.data }]} 
                type="area"
                height="320px"
                width="100%"
              />
            ) : (
              <Chart
                options={{
                  chart: { fontFamily: `inherit`, foreColor: "#9ca3af", toolbar: { show: false } },
                  stroke: { width: 4, curve: "smooth" },
                  xaxis: {
                    type: "category",
                    categories: overallDonationsChart.categories, 
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
                series={[{ name: "Donations", data: overallDonationsChart.data }]} 
                type="area"
                height="320px"
                width="100%"
              />
            )}
          </div>
        )}
      </CardBox>

      {/* Gateway & Revenue Updates Grid */}
      <div className="grid grid-cols-12 gap-7 mt-6">
        
        <div className="col-span-12 lg:col-span-8">
          <CardBox className="border-0 shadow-sm rounded-2xl p-7 h-full">
            <div className="grid grid-cols-12 gap-7">
              <div className="md:col-span-8 col-span-12">
                <div className="mb-6">
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Donations by Gateway</span>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
                    ${gatewayChart.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>

                {!loading && (
                  <Chart
                    options={{
                      chart: { fontFamily: "inherit", foreColor: "#9ca3af", toolbar: { show: false } },
                      legend: { show: false },
                      stroke: { width: 3, curve: "smooth" },
                      grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
                      colors: gatewayChart.colors.length ? gatewayChart.colors : ["#01A14B"],
                      markers: { size: 0 },
                      yaxis: { show: false },
                      xaxis: {
                        type: "category",
                        categories: gatewayChart.categories,
                        axisBorder: { show: false },
                        axisTicks: { show: false },
                      },
                      tooltip: { theme: "light", y: { formatter: (val) => `$${val}` } },
                    }}
                    series={gatewayChart.series}
                    type="line"
                    height="240px"
                    width="100%"
                  />
                )}
              </div>
              
              <div className="md:col-span-4 col-span-12">
                <div className="flex flex-col gap-3 mt-2">
                  {!loading && gatewayChart.totals.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}>
                        <Icon icon={item.icon} height={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 truncate">{item.name}</p>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBox>
        </div>

        <div className="col-span-12 lg:col-span-4"> 
          <CardBox className="h-full border-0 shadow-sm rounded-2xl p-7">
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">Profit Analysis</h4>
              <span className="text-sm text-gray-500">Net Donations vs Revenue</span>
            </div>

            {!loading && (
              <div className="-ml-2">
                <Chart
                  options={{
                    chart: { fontFamily: `inherit`, foreColor: "#9ca3af", toolbar: { show: false } },
                    plotOptions: { bar: { horizontal: false, columnWidth: "35%", borderRadius: 6 } },
                    dataLabels: { enabled: false },
                    stroke: { show: true, width: 3, colors: ["transparent"] },
                    colors: ["#01A14B", "#f5b225"],
                    xaxis: {
                      categories: revenueUpdatesChart.categories,
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                    },
                    yaxis: { labels: { formatter: (val) => `$${val}` } },
                    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
                    legend: { position: "top", horizontalAlign: "left", markers: { shape: "circle" } },
                    tooltip: { theme: "light", y: { formatter: (val) => `$${val}` } },
                  }}
                  series={[
                    { name: `Net: $${revenueUpdatesChart.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, data: revenueUpdatesChart.netDonations },
                    { name: `Rev: $${revenueUpdatesChart.totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, data: revenueUpdatesChart.revenue }
                  ]}
                  type="bar"
                  height="260px"
                  width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>

      </div>

      {/* Top Campaigns & Recent Donations Grid */}
      <div className="grid grid-cols-12 gap-7 mt-6">
        
        <div className="col-span-12 lg:col-span-8">
          <CardBox className="p-0 border-0 shadow-sm rounded-2xl h-full flex flex-col overflow-hidden">
            <div className="p-7 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h5 className="text-xl font-bold text-gray-900 dark:text-white">Top Performing Campaigns</h5>
              <p className="text-sm text-gray-500 mt-1">
                {topCampaignsTotals.count} Campaigns • ${topCampaignsTotals.totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Raised in period
              </p>
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
                      topCampaigns.map((item, index) => {
                        const raised = Number(item.fund_raised) || 0;
                        const goal = Number(item.goal_amount) || 0;
                        const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
                        const isFunded = raised >= goal && goal > 0;
                        
                        const statusColor = item.status === "published" ? "lightSuccess" : item.status === "draft" ? "lightSecondary" : "lightWarning";
                        const progressColor = isFunded ? "success" : "primary";
                        const imgUrl = item.images?.[0]?.sizes?.thumbnail?.url || "";

                        return (
                          <TableRow key={item.id || index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors border-0">
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
                                  <Link href={`/dashboard/campaigns/${item.id}`} className="hover:text-primary transition-colors">
                                    <h6 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title || "Untitled"}</h6>
                                  </Link>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="px-4 py-4 min-w-[200px]">
                              <div className="flex justify-between items-end mb-2">
                                <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                                  ${raised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h5>
                                {item.has_goal && goal > 0 && (
                                  <span className="text-xs text-gray-500">
                                    of ${goal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                )}
                              </div>
                              <Progress value={item.has_goal && goal > 0 ? percentage : 100} variant={progressColor as any} className="h-1.5" />
                            </TableCell>

                            <TableCell className="px-7 py-4 text-right">
                              <Badge variant={statusColor as any} className="capitalize rounded-full px-3 py-1 font-medium shadow-sm">
                                {item.status || "Unknown"}
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

        <div className="col-span-12 lg:col-span-4">
          <CardBox className="border-0 shadow-sm rounded-2xl h-full flex flex-col p-7">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-xl font-bold text-gray-900 dark:text-white">Recent Donations</h5>
            </div>

            <div className="flex flex-col gap-4 flex-grow">
              {loading ? (
                <div className="text-center text-sm text-gray-500 py-10">Loading donations...</div>
              ) : recentDonations.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-10">No recent donations.</div>
              ) : (
                recentDonations.map((item, index) => {
                  const donorName = item.donor?.first_name 
                    ? `${item.donor.first_name} ${item.donor.last_name || ""}`.trim()
                    : item.is_anonymous 
                      ? "Anonymous" 
                      : "Unknown Donor";
                  
                  const initial = donorName.charAt(0).toUpperCase();
                  const amount = parseFloat(item.amount) || 0;
                  const campaignTitle = item.campaign?.title || "Unknown Campaign";
                  const avatarUrl = item.donor?.image;
                  const bgClassColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

                  return (
                    <div className="flex gap-4 items-center p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow" key={item.id || index}>
                      <div className={`h-12 w-12 rounded-full flex shrink-0 justify-center items-center overflow-hidden font-bold text-lg bg-light${bgClassColor} dark:bg-dark${bgClassColor} text-${bgClassColor}`}>
                        {avatarUrl ? (
                          <Image src={avatarUrl} alt="donor" width={48} height={48} className="object-cover h-full w-full" />
                        ) : initial }
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate">{donorName}</h5>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{campaignTitle}</p>
                      </div>
                      <div className="ms-auto font-bold text-[#01A14B] shrink-0 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm">
                        +${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 mt-auto">
              <Button asChild variant="outline" className="w-full rounded-full border-gray-200 dark:border-gray-800 shadow-sm h-11">
                <Link href="/dashboard/donations">View All Activity</Link>
              </Button>
            </div>
          </CardBox>
        </div>
      </div>
      
    </div>
  );
}