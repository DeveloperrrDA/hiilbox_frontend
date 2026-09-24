import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import RoleDashboard from "@/app/components/growfund/role/RoleDashboard";
export default function DashboardPage(){return <><BreadcrumbComp title="Dashboard" items={[{title:"Dashboard"}]}/><RoleDashboard/></>}
