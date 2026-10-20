"use client"

import Image from "next/image";
import Link from "next/link";
import type { Campaign } from "@/lib/campaigns";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({
  campaign,
}: CampaignCardProps) {
  const progress =
    campaign.goal > 0
      ? Math.min(
          100,
          Math.round(
            (campaign.raised_amount / campaign.goal) * 100
          )
        )
      : 0;

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      // Mobile: Row layout (List View) | sm+: Column layout (Card View)
      className="group flex flex-row sm:flex-col items-center sm:items-stretch h-full w-full gap-4 sm:gap-0"
    >
      {/* =====================================================
          IMAGE
      ====================================================== */}
      <div 
        // Mobile: Fixed 100x100 square | sm+: Full width, flex-1 allows it to stretch vertically
        className="relative shrink-0 w-[100px] h-[100px] sm:w-full sm:flex-1 sm:min-h-[200px] overflow-hidden rounded-[14px] bg-lightgray dark:bg-darkgray transition-all duration-500 ease-out group-hover:scale-[1.02]"
      >
        {campaign.image_url ? (
          <Image
            src={campaign.image_url}
            alt={campaign.title}
            fill
            sizes="(max-width: 640px) 100px, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-lightgray dark:bg-darkgray text-xs sm:text-sm text-darkgray dark:text-white text-center p-2">
            No image
          </div>
        )}

        {/* =================================================
            VERIFIED BADGE (Hidden on mobile to save space)
        ================================================== */}
        <div className="hidden sm:flex absolute left-3 top-3 items-center gap-1.5 rounded-full bg-lightgray/70 px-2.5 py-1.5 text-sm font-bold text-gray-800">
          {campaign.number_of_contributions}
          <span>Donations</span>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      {/* FIXED: Added sm:flex-none and sm:justify-start so it doesn't stretch vertically on desktop */}
      <div className="flex flex-1 sm:flex-none flex-col justify-center sm:justify-start sm:pt-4 min-w-0 w-full">

        {/* TITLE & AUTHOR */}
        <div className="sm:h-16 mb-1 sm:mb-0">
          <h2 className="line-clamp-2 text-[15px] sm:text-[18px] font-bold leading-tight sm:leading-6 text-darkgray dark:text-white transition-colors group-hover:text-primary">
            {campaign.title}
          </h2>
          <p className="mt-0.5 sm:mt-1 text-[12px] sm:text-[13px] text-gray-500 dark:text-gray-400 line-clamp-1">
            by {campaign.fundraiser_name || "Organizer"}
          </p>
        </div>
        
        {/* =================================================
            PROGRESS
        ================================================== */}
        <div className="mt-2 sm:mt-2">

          {/* Progress bar */}
          <div className="h-1.5 sm:h-2.5 overflow-hidden rounded-full bg-darkgray/10 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Raised + Percentage */}
          <div className="mt-1.5 sm:mt-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-[13px] sm:text-base font-bold text-darkgray dark:text-white">
                ${Number(campaign.raised_amount).toLocaleString()}
              </span>
              <span className="text-[12px] sm:text-base text-darkgray dark:text-white">
                raised
              </span>
            </div>

            {/* Percentage hidden on mobile list view, visible on desktop grid */}
            <span className="hidden sm:inline text-base font-semibold text-darkgray dark:text-white">
              {progress}%
            </span>
          </div>

        </div>

      </div>

    </Link>
  );
}
