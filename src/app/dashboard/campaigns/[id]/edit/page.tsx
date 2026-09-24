import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import CampaignEditor from "@/app/components/growfund/CampaignEditor";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <><BreadcrumbComp title="Edit Campaign" items={[{ to: "/dashboard", title: "Dashboard" }, { to: "/dashboard/campaigns", title: "Campaigns" }, { title: "Edit" }]} /><CampaignEditor id={id}/></>;
}
