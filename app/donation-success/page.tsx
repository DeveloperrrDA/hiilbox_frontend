"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ThemeShell from "@/components/theme/ThemeShell";
import DonationReceiptDialog, { type DonationReceipt } from "@/components/DonationReceiptDialog";

type OrderState = {
  order_id: number;
  donation_id?: number | null;
  transaction_id: string | null;
  payment_method: string;
  status: string;
  payment_status: string;
  total?: string;
  currency?: string;
  donation_amount?: string;
  tip_amount?: string;
  campaign_id?: number | null;
  donor_name?: string;
  date_created?: string | null;
};

function DonationSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const orderKey = params.get("key");
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !orderKey) return;
    let cancelled = false;

    async function load() {
      try {
        let remembered: Partial<DonationReceipt> = {};
        try {
          const raw = sessionStorage.getItem(`hiilbox_receipt_${orderId}`);
          if (raw) remembered = JSON.parse(raw);
        } catch {}

        const response = await fetch(
          `/api/checkout/orders/${encodeURIComponent(orderId!)}?key=${encodeURIComponent(orderKey!)}`,
          { cache: "no-store" }
        );
        const data = (await response.json().catch(() => null)) as OrderState | null;
        if (!response.ok || !data) {
          throw new Error((data as any)?.message ?? "Unable to load your receipt.");
        }

        let campaignTitle = remembered.campaignTitle || "Campaign";
        if (!remembered.campaignTitle && data.campaign_id) {
          try {
            const campaignResponse = await fetch(`/api/campaigns/${data.campaign_id}`, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            });
            const campaignPayload = await campaignResponse.json().catch(() => null);
            campaignTitle = String(campaignPayload?.data?.title || campaignTitle);
          } catch {}
        }

        const built: DonationReceipt = {
          donationId: remembered.donationId ?? data.donation_id ?? null,
          orderId: data.order_id,
          transactionId: data.transaction_id,
          campaignTitle,
          amount: Number(remembered.amount ?? data.donation_amount ?? data.total ?? 0),
          tipAmount: Number(remembered.tipAmount ?? data.tip_amount ?? 0),
          total: Number(remembered.total ?? data.total ?? 0),
          currency: String(remembered.currency ?? data.currency ?? "USD"),
          donorName: String(remembered.donorName ?? data.donor_name ?? "Anonymous"),
          paymentMethod: String(remembered.paymentMethod ?? data.payment_method ?? "Payment"),
          paymentStatus: data.payment_status,
          date: String(remembered.date ?? data.date_created ?? new Date().toLocaleString()),
        };

        if (!cancelled) {
          setReceipt(built);
          setOpen(true);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unable to load your receipt.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [orderId, orderKey]);

  return (
    <ThemeShell>
      <main className="min-h-[70vh] bg-lightgray">
        <div className="container-1218 mx-auto flex min-h-[70vh] items-center justify-center px-4 py-14">
          {!orderId ? (
            <div className="rounded-2xl border border-error/20 bg-white p-7 text-sm text-error shadow-md">
              No donation order was provided.
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-error/20 bg-white p-7 text-sm text-error shadow-md">
              {error}
            </div>
          ) : !receipt ? (
            <div className="rounded-2xl border border-ld bg-white p-7 text-sm text-darklink shadow-md">
              Confirming your donation and preparing your receipt…
            </div>
          ) : (
            <p className="text-sm text-darklink">Your donation receipt is ready.</p>
          )}
        </div>

        <DonationReceiptDialog
          open={Boolean(receipt) && open}
          receipt={receipt}
          onOpenChange={setOpen}
        />
      </main>
    </ThemeShell>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-lightgray px-4 py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-ld bg-white p-8 text-sm text-darklink shadow-md">
            Preparing your donation receipt…
          </div>
        </main>
      }
    >
      <DonationSuccessContent />
    </Suspense>
  );
}
