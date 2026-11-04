import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import RoleCampaignManager from "@/app/components/growfund/role/RoleCampaignManager";
export const metadata: Metadata={title:"Campaigns | GrowFund"};
export default function Page(){return <><BreadcrumbComp title="Campaigns" items={[{to:"/dashboard",title:"Dashboard"},{title:"Campaigns"}]}/><RoleCampaignManager/></>}
