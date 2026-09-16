import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import RoleDonationManager from "@/app/components/growfund/role/RoleDonationManager";
export const metadata: Metadata = { title: "Donations | GrowFund" };
export default function DonationsPage(){return <><BreadcrumbComp title="Donations" items={[{to:"/dashboard",title:"Dashboard"},{title:"Donations"}]}/><RoleDonationManager/></>}
