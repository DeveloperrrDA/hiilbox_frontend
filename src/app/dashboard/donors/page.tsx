import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import AdminDonorManager from "@/app/components/growfund/admin/AdminDonorManager";
export const metadata: Metadata = { title: "Donors | GrowFund Admin" };
export default function DonorsPage(){return <><BreadcrumbComp title="Donors" items={[{to:"/dashboard",title:"Dashboard"},{title:"Donors"}]}/><AdminDonorManager/></>}
