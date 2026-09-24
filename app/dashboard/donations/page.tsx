import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import AdminDonationManager from "@/app/components/growfund/admin/AdminDonationManager";
export const metadata: Metadata = { title: "Donations | GrowFund Admin" };
export default function DonationsPage(){return <><BreadcrumbComp title="Donations" items={[{to:"/dashboard",title:"Dashboard"},{title:"Donations"}]}/><AdminDonationManager/></>}
