import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import CampaignManager from "@/app/components/growfund/CampaignManager";

export const metadata: Metadata = { title: "My Campaigns | GrowFund" };

export default function CampaignsDashboardPage() {
  return <><BreadcrumbComp title="My Campaigns" items={[{ to: "/dashboard", title: "Dashboard" }, { title: "Campaigns" }]} /><CampaignManager /></>;
}
