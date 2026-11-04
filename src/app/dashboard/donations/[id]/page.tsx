import type { Metadata } from "next";
import AdminDonationDetail from "@/app/components/growfund/admin/AdminDonationDetail";

export const metadata: Metadata = { title: "Donation Details | GrowFund Admin" };

export default async function DonationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminDonationDetail donationId={Number(id)} />;
}
