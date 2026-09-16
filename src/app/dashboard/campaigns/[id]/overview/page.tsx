import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import CampaignOverview from "@/app/components/growfund/CampaignOverview";

export default async function CampaignOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <>
    <BreadcrumbComp title="Campaign Overview" items={[{ to: "/dashboard", title: "Dashboard" }, { to: "/dashboard/campaigns", title: "Campaigns" }, { title: "Overview" }]} />
    <CampaignOverview id={id}/>
  </>;
}
