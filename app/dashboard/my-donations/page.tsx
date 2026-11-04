import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import DonorDonations from "@/app/components/growfund/donor/DonorDonations";
export default function Page(){return <><BreadcrumbComp title="My Donations" items={[{to:"/dashboard",title:"Dashboard"},{title:"My Donations"}]}/><DonorDonations/></>}
