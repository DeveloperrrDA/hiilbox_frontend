"use client";

import Link from "next/link";
import { jsPDF } from "jspdf";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type DonationReceipt = {
  donationId?: number | null;
  orderId: number;
  transactionId?: string | null;
  campaignTitle: string;
  amount: number;
  tipAmount?: number;
  total: number;
  currency: string;
  donorName?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  date?: string;
};

function safe(value: unknown, fallback = "-") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export default function DonationReceiptDialog({
  open,
  receipt,
  onOpenChange,
}: {
  open: boolean;
  receipt: DonationReceipt | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!receipt) return null;

  // Keep a stable non-null reference for nested callbacks such as downloadPdf.
  // TypeScript does not preserve prop narrowing inside a nested function because
  // the prop could theoretically change before that callback runs.
  const currentReceipt = receipt;

  const status = safe(currentReceipt.paymentStatus, "paid");
  const paid = ["paid", "processing", "completed"].includes(status.toLowerCase());
  const receiptNumber = currentReceipt.donationId
    ? `DON-${currentReceipt.donationId}`
    : `ORD-${currentReceipt.orderId}`;

  function downloadPdf() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const left = 20;
    const right = 190;
    let y = 24;

    doc.setFillColor(1, 161, 75);
    doc.rect(0, 0, 210, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("HIILBOX", left, 16);

    doc.setTextColor(17, 28, 45);
    doc.setFontSize(18);
    y = 38;
    doc.text("Donation Receipt", left, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 106, 133);
    y += 7;
    doc.text(`Receipt: ${receiptNumber}`, left, y);
    doc.text(`Date: ${safe(currentReceipt.date, new Date().toLocaleString())}`, right, y, { align: "right" });

    y += 12;
    doc.setDrawColor(224, 230, 235);
    doc.line(left, y, right, y);

    const rows: Array<[string, string]> = [
      ["Campaign", safe(currentReceipt.campaignTitle)],
      ["Donation number", receiptNumber],
      ["Order number", `#${currentReceipt.orderId}`],
      ["Donor", safe(currentReceipt.donorName, "Anonymous")],
      ["Donation amount", `${currentReceipt.currency} ${Number(currentReceipt.amount || 0).toFixed(2)}`],
      ["Hiilbox support", `${currentReceipt.currency} ${Number(currentReceipt.tipAmount || 0).toFixed(2)}`],
      ["Total", `${currentReceipt.currency} ${Number(currentReceipt.total || 0).toFixed(2)}`],
      ["Payment method", safe(currentReceipt.paymentMethod)],
      ["Payment status", status],
    ];
    if (currentReceipt.transactionId) rows.push(["Transaction", safe(currentReceipt.transactionId)]);

    y += 10;
    rows.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 106, 133);
      doc.text(label, left, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 28, 45);
      const wrapped = doc.splitTextToSize(value, 92);
      doc.text(wrapped, right, y, { align: "right" });
      y += Math.max(9, wrapped.length * 5.5);
    });

    y += 2;
    doc.setDrawColor(224, 230, 235);
    doc.line(left, y, right, y);

    y += 12;
    doc.setFillColor(234, 248, 240);
    doc.roundedRect(left, y, 170, 22, 3, 3, "F");
    doc.setTextColor(1, 122, 57);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      paid ? "Thank you. Your donation has been confirmed." : "Your payment is being confirmed.",
      left + 8,
      y + 13
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 106, 133);
    doc.text("Generated securely by Hiilbox.", left, 284);

    doc.save(`hiilbox-receipt-${receiptNumber.toLowerCase()}.pdf`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border border-ld p-0 shadow-2xl">
        <div className="h-2 bg-primary" />
        <div className="p-6 sm:p-8">
          <DialogHeader className="items-center text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-lightprimary text-primary">
              <Icon icon="solar:check-circle-bold-duotone" height={38} />
            </div>
            <DialogTitle className="text-2xl font-bold text-dark">
              Donation {paid ? "confirmed" : "received"}
            </DialogTitle>
            <DialogDescription className="max-w-md leading-6">
              Thank you for supporting this campaign. Your receipt details are below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-7 overflow-hidden rounded-2xl border border-ld bg-white">
            <div className="border-b border-ld bg-lightgray px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Hiilbox receipt</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-dark">{receiptNumber}</h3>
                <span className="rounded-full bg-lightprimary px-3 py-1 text-xs font-bold capitalize text-primary">
                  {status}
                </span>
              </div>
            </div>

            <div className="space-y-4 p-5 text-sm">
              <div>
                <p className="text-xs text-darklink">Campaign</p>
                <p className="mt-1 font-semibold text-dark">{currentReceipt.campaignTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-ld py-4">
                <div>
                  <p className="text-xs text-darklink">Donation number</p>
                  <p className="mt-1 font-semibold text-dark">{receiptNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-darklink">Order</p>
                  <p className="mt-1 font-semibold text-dark">#{currentReceipt.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-darklink">Donor</p>
                  <p className="mt-1 font-semibold text-dark">{safe(currentReceipt.donorName, "Anonymous")}</p>
                </div>
                <div>
                  <p className="text-xs text-darklink">Payment method</p>
                  <p className="mt-1 font-semibold text-dark">{safe(currentReceipt.paymentMethod)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-darklink">Donation</span>
                  <strong>{currentReceipt.currency} {Number(currentReceipt.amount || 0).toFixed(2)}</strong>
                </div>
                {Number(currentReceipt.tipAmount || 0) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-darklink">Hiilbox support</span>
                    <strong>{currentReceipt.currency} {Number(currentReceipt.tipAmount || 0).toFixed(2)}</strong>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-ld pt-3 text-base">
                  <span className="font-semibold text-dark">Total</span>
                  <strong className="text-primary">{currentReceipt.currency} {Number(currentReceipt.total || 0).toFixed(2)}</strong>
                </div>
              </div>

              {currentReceipt.transactionId && (
                <div className="rounded-xl bg-lightgray p-4">
                  <p className="text-xs text-darklink">Transaction ID</p>
                  <p className="mt-1 break-all font-mono text-xs font-semibold text-dark">
                    {currentReceipt.transactionId}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button type="button" onClick={downloadPdf} className="w-full">
              <Icon icon="solar:download-minimalistic-bold-duotone" />
              Download PDF
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/campaigns">Explore campaigns</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
