"use client";

import { useState, useEffect } from "react";
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

export default function CampaignRecentDonations({
  initialDonations,
  totalCount,
}: {
  initialDonations: Donation[];
  totalCount: number;
}) {
  // Load all initial donations (or a reasonable chunk like 50) so they can be scrolled
  const [donations, setDonations] = useState<Donation[]>(initialDonations);

  useEffect(() => {
    if (initialDonations.length === 0) return;

    // Simulate a new donation arriving after 6 seconds
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * initialDonations.length);
      const clonedDonation = { ...initialDonations[randomIndex] };

      const newDonation: Donation = {
        ...clonedDonation,
        id: `simulated-${Date.now()}`,
        is_new_simulation: true,
      };

      setDonations((prev) => {
        // Add to the top without cutting off the rest of the list
        return [newDonation, ...prev];
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [initialDonations]);

  const formatTime = (dateString?: string | null, isNew?: boolean) => {
    if (isNew) return "Recent donation";
    if (!dateString) return "Recent donation";

    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)} mins`;
    if (diffHours < 24) return `${diffHours} hrs`;
    return `${diffDays} days`;
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7e22ce]">
          <Icon icon="tabler:trending-up" className="text-2xl" />
        </div>
        <p className="text-base font-bold text-[#7e22ce]">
          {totalCount.toLocaleString()} recent donations
        </p>
      </div>

      {/* List Container - Fixed height (approx 5 items) with scrollbar */}
      <div className="flex flex-col max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        {donations.length > 0 ? (
          donations.map((donation) => {
            const isAnon = donation.is_anonymous;
            const name = isAnon
              ? "Anonymous"
              : String(donation.donor_name || "Anonymous").trim();
            const initial = name.charAt(0).toUpperCase();

            const animationClass = donation.is_new_simulation
              ? "animate-[slideDownFade_0.5s_ease-out_forwards]"
              : "";

            return (
              <div
                key={donation.id}
                className={`flex items-center gap-4 py-3.5 ${animationClass}`}
              >
                {/* Avatar */}
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#f3f5f7] text-lg font-bold text-[#111c2d]">
                  {isAnon ? (
                    // Anonymous uses the heart icon
                    <Icon icon="solar:hand-heart-linear" className="text-[22px]" />
                  ) : (
                    // Named donors use their first letter
                    initial
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <p className="text-[15px] font-semibold text-[#111c2d]">
                    {name}
                  </p>
                  <div className="mt-0.5 flex items-center text-sm text-[#5a6a85]">
                    <span className="font-bold text-[#111c2d]">
                      {(!donation.currency || donation.currency === "USD") ? "$" : `${donation.currency} `}
                      {Number(donation.amount || 0).toLocaleString()}
                    </span>
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

      {/* Bottom Buttons */}
      <div className="mt-5 flex items-center gap-3">
        <button className="w-full rounded-full border border-[#dfe5eb] py-2.5 text-[15px] font-bold text-[#111c2d] transition-colors hover:bg-gray-50">
          See all
        </button>
        <button className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#dfe5eb] py-2.5 text-[15px] font-bold text-[#111c2d] transition-colors hover:bg-gray-50">
          <Icon icon="solar:star-outline" className="text-lg" />
          See top
        </button>
      </div>

      {/* Inline Keyframes for the slide-down animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-20px); background-color: #f0fdf4; }
          to { opacity: 1; transform: translateY(0); background-color: transparent; }
        }
      `}} />
    </div>
  );
}