import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import RoleAnalytics from "@/app/components/growfund/role/RoleAnalytics";
export const metadata: Metadata = { title: "Analytics | GrowFund" };
export default function AnalyticsPage(){return <><BreadcrumbComp title="Analytics" items={[{to:"/dashboard",title:"Dashboard"},{title:"Analytics"}]}/><RoleAnalytics/></>}
