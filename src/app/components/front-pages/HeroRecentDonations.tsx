"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { type Donation } from "@/lib/donations";

// Fallback data with 8 items so we can clearly see the 4-by-4 batch rotation if the API is empty
const fallbackDonations: Donation[] = [
  { id: "mock1", donor_name: "Amina Hassan", amount: 50, currency: "USD", created_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: "mock2", donor_name: "Mohamed Ali", amount: 100, currency: "USD", created_at: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: "mock3", donor_name: "Fatima Ahmed", amount: 25, currency: "USD", created_at: new Date(Date.now() - 28 * 60000).toISOString() },
  { id: "mock4", donor_name: "Hassan Yusuf", amount: 75, currency: "USD", created_at: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: "mock5", donor_name: "Khadija Noor", amount: 200, currency: "USD", created_at: new Date(Date.now() - 120 * 60000).toISOString() },
  { id: "mock6", donor_name: "Anonymous", amount: 10, currency: "USD", created_at: new Date(Date.now() - 150 * 60000).toISOString() },
  { id: "mock7", donor_name: "Saeed Jama", amount: 150, currency: "USD", created_at: new Date(Date.now() - 200 * 60000).toISOString() },
  { id: "mock8", donor_name: "Farah Abdi", amount: 40, currency: "USD", created_at: new Date(Date.now() - 240 * 60000).toISOString() },
];

export default function HeroRecentDonations({ donations }: { donations: Donation[] }) {
  // Use API data if available, otherwise fallback
  const sourceDonations = donations && donations.length > 0 ? donations : fallbackDonations;
  
  // Track the starting index of the current batch of 4
  const [batchStartIndex, setBatchStartIndex] = useState(0);
  
  // Track a unique ID for the batch to force React to restart CSS animations when it changes
  const [batchId, setBatchId] = useState(0);

  // Rotate entire batch of 4 every 5 seconds
  useEffect(() => {
    // If we have 4 or fewer items, no need to rotate
    if (sourceDonations.length <= 4) return;

    const interval = setInterval(() => {
      setBatchStartIndex((prevIndex) => (prevIndex + 4) % sourceDonations.length);
      setBatchId((prevId) => prevId + 1);
    }, 5000); // 5 seconds per batch

    return () => clearInterval(interval);
  }, [sourceDonations.length]);

  const formatTimeAgo = (dateString?: string | null) => {
    if (!dateString) return "Recent";
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${Math.max(1, diffMins)} mins ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    return "1 day ago";
  };

  if (sourceDonations.length === 0) {
    return <div className="h-[120px] w-full"></div>;
  }

  // Get the current 4 items to display, wrapping around to the beginning if necessary
  const currentBatch: Donation[] = [];
  const itemsToShow = Math.min(4, sourceDonations.length);
  for (let i = 0; i < itemsToShow; i++) {
    currentBatch.push(sourceDonations[(batchStartIndex + i) % sourceDonations.length]);
  }

  return (
    <div className="relative flex w-full flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] dark:border-gray-800 dark:bg-dark dark:shadow-black/40">
      
      {/* Title (Full Width Top) */}
      <div className="flex w-full items-center gap-2 border-b border-gray-50 pb-3 dark:border-gray-800/50">
        <div className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#01A14B] opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#01A14B]"></span>
        </div>
        <span className="text-sm font-bold text-[#0F1F17] dark:text-white">Recent Donations</span>
      </div>

      {/* Grid List of 4 */}
      <div className="grid w-full grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2 md:grid-cols-4">
        {currentBatch.map((donation, index) => {
          const isAnon = donation.is_anonymous;
          const name = isAnon ? "Anonymous" : String(donation.donor_name || "Anonymous").trim();
          const initial = name.charAt(0).toUpperCase();
          const currencySymbol = (!donation.currency || donation.currency === "USD") ? "$" : `${donation.currency} `;
          const amountFormatted = Number(donation.amount || 0).toLocaleString();

          return (
            <div
              // Combining donation ID and batchId forces React to re-mount the div and replay the animation
              key={`${donation.id}-${batchId}`}
              className="animate-slide-in-stagger flex shrink-0 items-center gap-3 opacity-0"
              style={{ animationDelay: `${index * 0.4}s` }} // 0.4s delay between each card's entry
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6F4EB] text-[11px] font-bold text-[#01A14B] dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                {isAnon ? <Icon icon="solar:hand-heart-bold" className="text-sm" /> : initial}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center leading-tight">
                <span className="max-w-[100px] truncate text-[12px] font-bold text-[#0F1F17] dark:text-white">
                  {name}
                </span>
                <div className="flex items-center text-[10px] text-gray-400">
                  <span className="font-bold text-[#01A14B] dark:text-[#8BD3A8]">
                    {currencySymbol}{amountFormatted}
                  </span>
                  <span className="mx-1.5">•</span>
                  <span className="whitespace-nowrap">{formatTimeAgo(donation.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInLeftFade {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-stagger {
          animation: slideInLeftFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}