"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface MobileStickyCTAProps {
  campaignId: string | number;
  title: string;
  progress: number;
  raisedAmount: number;
  goalAmount: number;
  lastDonationName?: string;
  lastDonationAmount?: number;
  currency?: string;
}

export default function MobileStickyCTA({
  campaignId,
  title,
  progress,
  raisedAmount,
  goalAmount,
  lastDonationName,
  lastDonationAmount,
  currency = "USD",
}: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
useEffect(() => {
  const target = document.getElementById("mobile-donate-section");

  if (!target) return;

  let sectionVisible = false;

  const updateVisibility = () => {
    setIsVisible(window.scrollY > 150 && !sectionVisible);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      sectionVisible = entry.isIntersecting;
      updateVisibility();
    },
    { threshold: 0 }
  );

  observer.observe(target);

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", updateVisibility);
  };
}, []);
  if (!isVisible) return null;

  // SVG Progress Math
  const size = 52;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, progress) / 100) * circumference;

  // Format large numbers (e.g., 650000 -> 650K)
  const formatCompact = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toLocaleString();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-4 rounded-t-[24px] border-t border-gray-200 bg-white p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-full duration-300 lg:hidden pb-safe">
      
      {/* TOP ROW: Stats & Latest Donation */}
      <div className="flex items-center gap-4">
        {/* Progress Circle */}
        <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle className="text-gray-100 dark:text-gray-800" stroke="currentColor" fill="transparent" strokeWidth={strokeWidth} cx={size / 2} cy={size / 2} r={radius} />
            <circle 
              className="text-[#52b946]" 
              stroke="currentColor" 
              fill="transparent" 
              strokeWidth={strokeWidth} 
              strokeLinecap="round" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              cx={size / 2} 
              cy={size / 2} 
              r={radius} 
            />
          </svg>
          <span className="absolute text-[11px] font-extrabold text-[#111c2d] dark:text-white">
            {progress}%
          </span>
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-extrabold text-[#111c2d]">
            ${raisedAmount.toLocaleString()} raised <span className="font-normal text-[#5a6a85]">of <span className="underline decoration-1 underline-offset-2">${formatCompact(goalAmount)}{currency}</span></span>
          </p>
          {lastDonationName && lastDonationAmount ? (
            <p className="mt-0.5 flex items-center text-[13px] text-[#5a6a85]">
              <span className="truncate">{lastDonationName} donated ${lastDonationAmount.toLocaleString()}</span>
              <Icon icon="solar:alt-arrow-right-outline" className="ml-0.5 shrink-0" />
            </p>
          ) : (
            <p className="mt-0.5 text-[13px] text-[#5a6a85]">Be the first to donate</p>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: Action Buttons */}
      <div className="flex flex-row gap-3">
        <Link
          href={`/checkout?campaign=${campaignId}&title=${encodeURIComponent(title)}`}
          className="flex-1 rounded-full bg-primary py-3.5 text-center text-[15px] font-extrabold text-white transition-colors hover:bg-primary"
        >
          Donate
        </Link>
        <Link
          href="#"
          className="flex-1 rounded-full bg-lightprimary py-3.5 text-center text-[15px] font-extrabold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Share
        </Link>
      </div>
    </div>
  );
}
