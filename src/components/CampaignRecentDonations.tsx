"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface Donation {
  id: string | number;
  donor_name?: string | null;
  is_anonymous?: boolean;
  amount: number | string;
  currency?: string | null;
  created_at?: string | null;
  is_new_simulation?: boolean;
}

type PopupMode = "newest" | "top" | null;

export default function CampaignRecentDonations({
  initialDonations,
  totalCount,
}: {
  initialDonations: Donation[];
  totalCount: number;
}) {
  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const donations = initialDonations;

  const formatTime = (dateString?: string | null, isNew?: boolean): string => {
    if (isNew || !dateString) return "Recent donation";
    const timestamp = new Date(dateString).getTime();
    if (!Number.isFinite(timestamp)) return "Recent donation";
    const diffMins = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${Math.max(1, diffMins)} mins`;
    if (diffHours < 24) return `${diffHours} hrs`;
    return `${diffDays} days`;
  };

  const formatAmount = (donation: Donation): string => {
    const prefix = !donation.currency || donation.currency === "USD" ? "$" : `${donation.currency} `;
    return `${prefix}${Number(donation.amount || 0).toLocaleString()}`;
  };

  const donorName = (donation: Donation): string =>
    donation.is_anonymous ? "Anonymous" : String(donation.donor_name || "Anonymous").trim() || "Anonymous";

  const popupDonations = [...donations].sort((a, b) => {
    if (popupMode === "top") return Number(b.amount) - Number(a.amount);
    const aTime = new Date(a.created_at || 0).getTime() || 0;
    const bTime = new Date(b.created_at || 0).getTime() || 0;
    return bTime - aTime;
  });

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E6F6ED] text-[#01A14B]">
          <Icon icon="tabler:trending-up" className="text-2xl" />
        </div>
        <p className="text-base font-bold text-[#01A14B]">
          {totalCount.toLocaleString()} recent donations
        </p>
      </div>

      <div className="flex max-h-[380px] flex-col overflow-y-auto pr-2">
        {donations.length > 0 ? (
          donations.map((donation) => {
            const name = donorName(donation);
            return (
              <div
                key={donation.id}
                className={`flex items-center gap-4 py-3.5 ${donation.is_new_simulation ? "animate-[slideDownFade_0.5s_ease-out_forwards]" : ""}`}
              >
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#f3f5f7] text-lg font-bold text-[#111c2d]">
                  {donation.is_anonymous ? (
                    <Icon icon="solar:hand-heart-linear" className="text-[22px]" />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex flex-col">
                  <p className="truncate text-[15px] font-semibold text-[#111c2d]">{name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center text-sm text-[#5a6a85]">
                    <span className="font-bold text-[#111c2d]">{formatAmount(donation)}</span>
                    <span className="mx-2 text-[#dfe5eb]">•</span>
                    <span>{formatTime(donation.created_at, donation.is_new_simulation)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-4 text-sm text-gray-400">No donations yet.</p>
        )}
      </div>

      <div className="mb-4 mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setPopupMode("newest")}
          className="rounded-lg border border-[#e0e6eb] bg-white px-4 py-2 text-sm font-semibold text-[#111c2d] hover:border-[#01A14B]"
        >
          See All
        </button>
        <button
          type="button"
          onClick={() => setPopupMode("top")}
          className="rounded-lg border border-[#e0e6eb] bg-white px-4 py-2 text-sm font-semibold text-[#111c2d] hover:border-[#01A14B]"
        >
          See Top
        </button>
      </div>

      {popupMode !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-transparent p-4"
          onClick={() => setPopupMode(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Donations"
            className="flex max-h-[85vh] w-full max-w-[452px] flex-col overflow-hidden rounded-2xl border border-[#e0e6eb] bg-white p-6 shadow-[0_12px_48px_rgba(17,28,45,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#e0e6eb] pb-4">
              <h2 className="text-2xl font-bold text-[#111c2d]">Donations</h2>
              <button
                type="button"
                aria-label="Close donations"
                onClick={() => setPopupMode(null)}
                className="rounded-full p-2 text-[#5a6a85] hover:bg-gray-100"
              >
                <Icon icon="tabler:x" className="text-xl" />
              </button>
            </div>

            <div className="mb-4 flex gap-3">
              {(["newest", "top"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPopupMode(mode)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold ${
                    popupMode === mode
                      ? "bg-[#01A14B] text-white"
                      : "border border-[#e0e6eb] bg-white text-[#111c2d]"
                  }`}
                >
                  {mode === "newest" ? "Newest" : "Top"}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {popupDonations.length === 0 ? (
                <p className="py-6 text-sm text-gray-500">No donations yet.</p>
              ) : (
                popupDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center gap-3 border-b border-[#f0f2f4] py-3 last:border-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E6F6ED] font-bold text-[#01A14B]">
                      {donation.is_anonymous ? (
                        <Icon icon="solar:hand-heart-linear" className="text-xl" />
                      ) : (
                        donorName(donation).charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#111c2d]">{donorName(donation)}</p>
                      <p className="mt-1 text-sm text-[#5a6a85]">
                        {formatAmount(donation)} · {formatTime(donation.created_at, donation.is_new_simulation)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-20px); background-color: #f0fdf4; }
          to { opacity: 1; transform: translateY(0); background-color: transparent; }
        }
      `}</style>
    </div>
  );
}
