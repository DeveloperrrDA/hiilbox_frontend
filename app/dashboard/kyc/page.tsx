import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import AdminKycManager from "@/app/components/growfund/admin/AdminKycManager";

export const metadata: Metadata = {
  title: "KYC | GrowFund Admin",
};

export default function KycPage() {
  return (
    <>
      <BreadcrumbComp
        title="KYC"
        items={[
          { to: "/dashboard", title: "Dashboard" },
          { title: "KYC" },
        ]}
      />

      <AdminKycManager />
    </>
  );
}