import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import AdminCampaignManager from "@/app/components/growfund/admin/AdminCampaignManager";
export const metadata: Metadata = { title: "Campaigns | GrowFund Admin" };
export default function CampaignsDashboardPage() {
  return <><BreadcrumbComp title="Campaigns" items={[{ to: "/dashboard", title: "Dashboard" }, { title: "Campaigns" }]} /><AdminCampaignManager /></>;
}
