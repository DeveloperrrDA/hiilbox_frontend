import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import FundraiserDashboard from "@/app/components/growfund/FundraiserDashboard";

export default function DashboardPage() {
  return (
    <>
      <BreadcrumbComp title="Fundraiser Dashboard" items={[{ title: "Dashboard" }]} />
      <FundraiserDashboard />
    </>
  );
}
