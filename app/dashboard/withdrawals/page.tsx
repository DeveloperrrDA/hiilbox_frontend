import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import RoleWithdrawalManager from "@/app/components/growfund/role/RoleWithdrawalManager";
export const metadata: Metadata={title:"Withdrawals | GrowFund"};
export default function Page(){return <><BreadcrumbComp title="Withdrawals" items={[{to:"/dashboard",title:"Dashboard"},{title:"Withdrawals"}]}/><RoleWithdrawalManager/></>}
