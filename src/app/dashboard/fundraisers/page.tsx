import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import AdminFundraiserManager from "@/app/components/growfund/admin/AdminFundraiserManager";
export const metadata: Metadata = { title: "Fundraisers | GrowFund Admin" };
export default function FundraisersPage(){return <><BreadcrumbComp title="Fundraisers" items={[{to:"/dashboard",title:"Dashboard"},{title:"Fundraisers"}]}/><AdminFundraiserManager/></>}
