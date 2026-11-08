"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
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
  campaignId,
  initialDonations,
  totalCount,
  isMobileMode = false,
  campaignImage = "", 
}: {
  campaignId: number;
  initialDonations: Donation[];
  totalCount: number;
  isMobileMode?: boolean;
  campaignImage?: string; 
}) {
  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const controller = new AbortController();

    async function loadDonations() {
      setLoading(true);
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/donations`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load donations");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setDonations(result.data);
        }
      } catch (error) {
        if (!controller.signal.aborted) console.error("Unable to load donations:", error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadDonations();
    return () => controller.abort();
  }, [campaignId]);

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

  // Extract modal to variable to be rendered via Portal
  const modalContent = popupMode !== null ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setPopupMode(null)}>
      
      <div 
        role="dialog" 
        aria-modal="true" 
        className="relative flex max-h-[85vh] h-[750px] w-full max-w-[500px] flex-col overflow-hidden rounded-[20px] bg-white dark:bg-dark shadow-2xl animate-in zoom-in-95 duration-200" 
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-2xl font-extrabold text-[#111c2d] dark:text-white flex items-center gap-2">
            Donations <span className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-bold text-gray-700 dark:text-gray-300">{totalCount}</span>
          </h2>
          <button type="button" onClick={() => setPopupMode(null)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Icon icon="tabler:x" className="text-xl" />
          </button>
        </div>

        {/* Toggle Switch (Pill Style) */}
        <div className="px-6 py-4 flex gap-2 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setPopupMode("newest")} 
            className={`rounded-full px-5 py-2 text-[14px] font-bold transition-colors ${
              popupMode === "newest" 
                ? "bg-[#111c2d] text-white dark:bg-white dark:text-[#111c2d]" 
                : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setPopupMode("top")} 
            className={`rounded-full px-5 py-2 text-[14px] font-bold transition-colors ${
              popupMode === "top" 
                ? "bg-[#111c2d] text-white dark:bg-white dark:text-[#111c2d]" 
                : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Top
          </button>
        </div>

        {/* Donations List Container */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
          {popupDonations.length === 0 ? (
            <p className="py-6 text-sm text-gray-500">No donations yet.</p>
          ) : (
            popupDonations.map((donation, idx) => {
              
              // Shows after the 4th item (idx === 3), then every 10 items (idx === 13, 23, 33...)
              const showBanner = (idx === 3) || (idx > 3 && (idx - 3) % 10 === 0);
              
              return (
                <div key={donation.id}>
                  {/* Donation Item */}
                  <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-[#111c2d] dark:text-white">
                      {donation.is_anonymous ? <Icon icon="solar:hand-heart-linear" className="text-[20px]" /> : donorName(donation).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-[#111c2d] dark:text-white">{donorName(donation)}</p>
                      <p className="mt-0.5 text-sm font-bold text-[#111c2d] dark:text-gray-200 flex items-center gap-2">
                        {formatAmount(donation)} <span className="font-normal text-gray-400">• {formatTime(donation.created_at, donation.is_new_simulation)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Inline Call to Action Banner */}
                  {showBanner && (
                    <div className="my-4 overflow-hidden rounded-xl bg-lightprimary dark:bg-primary/20 flex items-stretch shadow-sm border border-[#01A14B]/10">
                      
                      {/* Left Side Image Element */}
                      <div 
                         className="w-24 shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-[#01A14B]/10"
                         style={{
                           backgroundImage: `url(${campaignImage || '/logo.png'})`,
                           backgroundSize: campaignImage ? 'cover' : 'contain',
                           backgroundPosition: 'center',
                           backgroundRepeat: 'no-repeat',
                         }}
                      />

                      {/* Right Side Content */}
                      <div className="flex flex-1 items-center justify-between p-4 gap-3">
                         <p className="text-[13px] font-bold text-[#111c2d] dark:text-white leading-snug">
                           Each gift brings hope — together, we create change.
                         </p>
                         <Link href={`/checkout?campaign=${campaignId}`} className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-[13px] font-bold text-white hover:bg-primary/80 transition-colors">
                           Donate
                         </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-dark/95 backdrop-blur border-t border-gray-100 dark:border-gray-800">
          <Link href={`/checkout?campaign=${campaignId}`} className="flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-base font-bold text-white transition-colors hover:bg-primary/80">
            Donate now
          </Link>
        </div>

      </div>
    </div>
  ) : null;

  return (
    <div className={isMobileMode ? "mt-4" : "mt-8"}>
      
      {/* 
        ================================================================
        MAIN SIDEBAR VIEW (Hidden if isMobileMode is true)
        ================================================================
      */}
      {!isMobileMode && (
        <>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E6F6ED] dark:bg-[#01A14B]/20 text-[#01A14B]">
              <Icon icon="tabler:trending-up" className="text-2xl" />
            </div>
            <p className="text-base font-bold text-[#111c2d] dark:text-white">
              {loading ? "Loading donations..." : `${totalCount.toLocaleString()} donations`}
            </p>
          </div>

          <div className="flex max-h-[380px] flex-col overflow-y-auto pr-2">
            {donations.length > 0 ? (
              donations.map((donation) => {
                const name = donorName(donation);
                return (
                  <div key={donation.id} className={`flex items-center gap-4 py-3.5 ${donation.is_new_simulation ? "animate-[slideDownFade_0.5s_ease-out_forwards]" : ""}`}>
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#f3f5f7] dark:bg-gray-800 text-lg font-bold text-[#111c2d] dark:text-white">
                      {donation.is_anonymous ? <Icon icon="solar:hand-heart-linear" className="text-[22px]" /> : name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-[15px] font-semibold text-[#111c2d] dark:text-white">{name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center text-sm text-[#5a6a85] dark:text-gray-300">
                        <span className="font-bold text-[#111c2d] dark:text-white">{formatAmount(donation)}</span>
                        <span className="mx-2 shrink-0 text-[#dfe5eb]">•</span>
                        <span className="truncate">{formatTime(donation.created_at, donation.is_new_simulation)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-sm text-gray-400">{loading ? "Loading donations..." : "No donations yet."}</p>
            )}
          </div>
        </>
      )}

      {/* Buttons (Always visible) */}
      <div className={`flex gap-3 ${isMobileMode ? "mb-2" : "mb-4 mt-4"}`}>
        <button type="button" onClick={() => setPopupMode("newest")} className="rounded-lg border border-[#e0e6eb] dark:border-gray-700 bg-white dark:bg-dark px-4 py-2 text-sm font-semibold text-[#111c2d] dark:text-white hover:border-[#01A14B]">See All</button>
        <button type="button" onClick={() => setPopupMode("top")} className="rounded-lg border border-[#e0e6eb] dark:border-gray-700 bg-white dark:bg-dark px-4 py-2 text-sm font-semibold text-[#111c2d] dark:text-white hover:border-[#01A14B]">See Top</button>
      </div>

      {/* Safe portal rendering for Next.js SSR to avoid hydration mismatch */}
      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
      
    </div>
  );
}