import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import RoleDonorManager from "@/app/components/growfund/role/RoleDonorManager";
export const metadata: Metadata = { title: "Donors | GrowFund" };
export default function DonorsPage(){return <><BreadcrumbComp title="Donors" items={[{to:"/dashboard",title:"Dashboard"},{title:"Donors"}]}/><RoleDonorManager/></>}
