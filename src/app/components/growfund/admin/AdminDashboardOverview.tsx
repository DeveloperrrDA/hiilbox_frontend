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

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    campaigns: { total: 0, chartData: [] as { x: string; y: number }[] },
    donations: { total: 0, chartData: [] as { x: string; y: number }[] },
    donors: { total: 0, chartData: [] as { x: string; y: number }[] },
    fundraisers: { total: 0, chartData: [] as { x: string; y: number }[] },
  });
  
  const [revenueChart, setRevenueChart] = useState({
    categories: [] as string[],
    data: [] as number[],
    total: 0,
  });

  const [overallDonationsChart, setOverallDonationsChart] = useState({
    categories: [] as string[],
    data: [] as number[],
    total: 0,
  });

  const [gatewayChart, setGatewayChart] = useState({
    total: 0,
    categories: [] as string[],
    series: [] as { name: string; data: number[] }[],
    colors: [] as string[],
    totals: [] as { name: string; amount: number; color: string; icon: string }[],
  });

  const [revenueUpdatesChart, setRevenueUpdatesChart] = useState({
    categories: [] as string[],
    netDonations: [] as number[],
    revenue: [] as number[],
    totalNet: 0,
    totalRev: 0,
  });

  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [topCampaignsTotals, setTopCampaignsTotals] = useState({ count: 0, totalRaised: 0 });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("Revenue");

  useEffect(() => {
    (async () => {
      try {
        const getQuarterLabel = (dateStr: string) => {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return null;
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `Q${quarter} ${date.getFullYear()}`;
        };

        const fetchAllPages = async (endpoint: string) => {
          const perPage = 100;
          const separator = endpoint.includes("?") ? "&" : "?";
          
          const firstPage = await adminApi(`${endpoint}${separator}page=1&per_page=${perPage}`);
          
          const apiTotal = Number(
            firstPage?.paginated?.total ?? 
            firstPage?.data?.total ?? 
            firstPage?.data?.data?.total ?? 
            firstPage?.total
          );
          
          let rows = rowsFrom(firstPage);
          const total = Number.isFinite(apiTotal) && apiTotal >= 0 ? apiTotal : rows.length;
          
          const totalPages = Math.ceil(total / perPage);
          
          if (totalPages > 1) {
            const promises = [];
            for (let i = 2; i <= totalPages; i++) {
              promises.push(adminApi(`${endpoint}${separator}page=${i}&per_page=${perPage}`));
            }
            const subsequentPages = await Promise.all(promises);
            
            subsequentPages.forEach((pageRes) => {
              rows = rows.concat(rowsFrom(pageRes));
            });
          }
          
          return { total, rows };
        };

        const todayDate = new Date().toISOString().split("T")[0];

        const fetchAnalytics = adminApi(`analytics?start_date=2025-01-01&end_date=${todayDate}&type=top-campaigns`);
        const fetchRecentDonations = adminApi(`analytics?start_date=2025-01-01&end_date=${todayDate}&type=recent-contributions`);

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
          const { total, rows } = res.value;

          const groupedByQuarter = rows.reduce((acc: Record<string, number>, item: any) => {
            const qLabel = getQuarterLabel(item[dateKey]);
            if (!qLabel) return acc;
            acc[qLabel] = (acc[qLabel] || 0) + 1;
            return acc;
          }, {});

          const chartData = Object.entries(groupedByQuarter)
            .map(([x, y]) => {
              const [q, year] = x.split(" ");
              const monthIndex = (parseInt(q.replace("Q", "")) - 1) * 3;
              return { x, y: y as number, tempDate: new Date(parseInt(year), monthIndex) };
            })
            .sort((a, b) => a.tempDate.getTime() - b.tempDate.getTime())
            .map(({ x, y }) => ({ x, y }));

          if (chartData.length === 0) {
            chartData.push({ x: "No Data", y: 0 });
          } else if (chartData.length === 1) {
             chartData.unshift({ x: "Start", y: 0 });
          }

          return { total, chartData };
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

          let minYear = new Date().getFullYear();
          let maxYear = minYear;

          if (completedDonations.length > 0) {
            const validYears = completedDonations
              .map((item: any) => new Date(item.created_at).getFullYear())
              .filter((y: number) => !isNaN(y));

            if (validYears.length > 0) {
              minYear = Math.min(...validYears);
              maxYear = Math.max(...validYears);
            }
          }

          const allChronologicalQuarters: string[] = [];
          for (let y = minYear; y <= maxYear; y++) {
            for (let q = 1; q <= 4; q++) {
              allChronologicalQuarters.push(`Q${q} ${y}`);
            }
          }

          const revenueByQuarter: Record<string, number> = {};
          const grossDonationsByQuarter: Record<string, number> = {};
          
          let totalGatewayDonations = 0;
          const gTotals: Record<string, number> = {};
          const gQuarterly: Record<string, Record<string, number>> = {};
          const netDonationsByQuarter: Record<string, number> = {};
          const revUpdatesByQuarter: Record<string, number> = {};
          
          let aggregateNetDonations = 0;
          let aggregateRevenue = 0;
          let aggregateGrossDonations = 0;

          completedDonations.forEach((item: any) => {
            const amount = parseFloat(item.amount) || 0;
            const gatewayFee = Math.abs(parseFloat(item.gateway_fee) || parseFloat(item.processing_fee) || 0);
            const platformFee = Math.abs(parseFloat(item.platform_fee) || 0);
            const tipAmount = Math.abs(parseFloat(item.tip_amount) || parseFloat(item.tip) || 0);

            const netDonation = amount - (gatewayFee + platformFee);
            const revenue = platformFee + tipAmount;

            const qLabel = getQuarterLabel(item.created_at);
            
            if (qLabel) {
              revenueByQuarter[qLabel] = (revenueByQuarter[qLabel] || 0) + revenue;
              grossDonationsByQuarter[qLabel] = (grossDonationsByQuarter[qLabel] || 0) + amount;

              const rawName = item.payment_method?.name || "other";
              const gInfo = GATEWAY_MAP[rawName] || { name: rawName, color: "primary", hex: "#6c757d", icon: "solar:dollar-minimalistic-line-duotone" };
              const gName = gInfo.name;

              totalGatewayDonations += amount;
              if (!gTotals[gName]) gTotals[gName] = 0;
              gTotals[gName] += amount;

              if (!gQuarterly[gName]) gQuarterly[gName] = {};
              gQuarterly[gName][qLabel] = (gQuarterly[gName][qLabel] || 0) + amount;
              
              netDonationsByQuarter[qLabel] = (netDonationsByQuarter[qLabel] || 0) + netDonation;
              revUpdatesByQuarter[qLabel] = (revUpdatesByQuarter[qLabel] || 0) + revenue;
              
              aggregateNetDonations += netDonation;
              aggregateRevenue += revenue;
              aggregateGrossDonations += amount;
            }
          });

          const overallRevenueData = allChronologicalQuarters.map((qLabel) => 
            Number((revenueByQuarter[qLabel] || 0).toFixed(2))
          );
          setRevenueChart({ categories: allChronologicalQuarters, data: overallRevenueData, total: aggregateRevenue });

          const overallDonationsData = allChronologicalQuarters.map((qLabel) => 
            Number((grossDonationsByQuarter[qLabel] || 0).toFixed(2))
          );
          setOverallDonationsChart({ categories: allChronologicalQuarters, data: overallDonationsData, total: aggregateGrossDonations });

          const sortedGatewayNames = Object.keys(gTotals).sort((a, b) => gTotals[b] - gTotals[a]);
          const gatewaySeries = sortedGatewayNames.map(gName => ({
            name: gName,
            data: allChronologicalQuarters.map(qLabel => Number((gQuarterly[gName]?.[qLabel] || 0).toFixed(2)))
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
            categories: allChronologicalQuarters,
            series: gatewaySeries,
            colors: dynamicColors,
            totals: gatewayIconData,
          });

          const netDonationsData = allChronologicalQuarters.map(q => Number((netDonationsByQuarter[q] || 0).toFixed(2)));
          const revUpdatesData = allChronologicalQuarters.map(q => Number((revUpdatesByQuarter[q] || 0).toFixed(2)));

          setRevenueUpdatesChart({
            categories: allChronologicalQuarters,
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
  }, []);

  return (
    <div className="space-y-7 bg-[#f8fafc] dark:bg-[#121621] min-h-screen pb-10">
      
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
          <Button className="rounded-full bg-[#01A14B] hover:bg-[#018b41] text-white shadow-sm text-sm h-10 px-6">
            <Icon icon="solar:add-circle-line-duotone" className="mr-2" height={18}/> New Action
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-error/30 bg-lighterror px-4 py-3 text-sm text-error mb-4">
          {error}
        </div>
      )}

      {/* Stats Grid - Explicitly Styled Cards */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* 1. Campaigns - Area Chart */}
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
                    tooltip: { theme: "dark", fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => "" } } },
                  }}
                  series={[{ name: "Campaigns", data: stats.campaigns.chartData }]}
                  type="area" height="80px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>

        {/* 2. Donations - TotalIncome Style */}
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
                    tooltip: { theme: "light", fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => "" } } },
                  }}
                  series={[{ name: "Donations", data: stats.donations.chartData }]}
                  type="area" height="80px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>

        {/* 3. Donors - Bar Chart */}
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
                    tooltip: { theme: "dark", fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => "" } } },
                  }}
                  series={[{ name: "Donors", data: stats.donors.chartData }]}
                  type="bar" height="70px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>

        {/* 4. Fundraisers - Area Chart */}
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
                    tooltip: { theme: "dark", fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => "" } } },
                  }}
                  series={[{ name: "Fundraisers", data: stats.fundraisers.chartData }]}
                  type="area" height="80px" width="100%"
                />
              </div>
            )}
          </CardBox>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <CardBox className="border-0 shadow-sm rounded-2xl mt-6">
        <div className="flex items-center gap-2 mb-5">
          <Icon icon="solar:widget-add-line-duotone" className="text-gray-400" height={20} />
          <h5 className="font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h5>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/withdrawals" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-primary/5 transition-all group">
            <div className="h-10 w-10 rounded-full bg-lightprimary dark:bg-darkprimary text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon="solar:card-send-line-duotone" height={22} />
            </div>
            <div>
              <h6 className="text-sm font-semibold">Withdrawals</h6>
              <p className="text-xs text-gray-500">Review requests</p>
            </div>
          </Link>
          <Link href="/dashboard/campaigns" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-primary/5 transition-all group">
            <div className="h-10 w-10 rounded-full bg-lightprimary dark:bg-darkprimary text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon="solar:shield-check-line-duotone" height={22} />
            </div>
            <div>
              <h6 className="text-sm font-semibold">Moderation</h6>
              <p className="text-xs text-gray-500">Manage campaigns</p>
            </div>
          </Link>
          <Link href="/dashboard/donations" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-primary/5 transition-all group">
            <div className="h-10 w-10 rounded-full bg-lightprimary dark:bg-darkprimary text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon="solar:bill-list-line-duotone" height={22} />
            </div>
            <div>
              <h6 className="text-sm font-semibold">Records</h6>
              <p className="text-xs text-gray-500">All transactions</p>
            </div>
          </Link>
        </div>
      </CardBox>

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
              {activeTab === "Revenue" ? "Total platform revenue and tips over time" : "Total gross donations processed over time"}
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
                {topCampaignsTotals.count} Campaigns • ${topCampaignsTotals.totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Raised
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