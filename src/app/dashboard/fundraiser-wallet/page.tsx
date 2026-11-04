import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import FundraiserWallet from "@/app/components/growfund/fundraiser/FundraiserWallet";
export default function Page(){return <><BreadcrumbComp title="Wallet" items={[{to:"/dashboard",title:"Dashboard"},{title:"Wallet"}]}/><FundraiserWallet/></>}
