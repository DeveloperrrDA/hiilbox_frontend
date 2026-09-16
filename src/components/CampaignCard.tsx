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
      className="group block"
    >
      {/* =====================================================
          IMAGE
      ====================================================== */}
      <div className="relative aspect-16/10 overflow-hidden rounded-[14px] bg-gray-100">

        {campaign.image_url ? (
          <Image
            src={campaign.image_url}
            alt={campaign.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
            No image available
          </div>
        )}

        {/* =================================================
            VERIFIED BADGE
        ================================================== */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-gray-800 shadow-sm backdrop-blur">

          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#01A14B] text-[8px] text-white">
            ✓
          </span>

          Verified

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="pt-4">

        {/* TITLE */}
        <div className="h-20">
          <h2 className="line-clamp-2 text-[20px] font-bold leading-5 text-gray-950 transition-colors group-hover:text-[#01A14B] sm:text-[18px]">
            {campaign.title}
          </h2>
        </div>


        {/* FUNDRAISER */}
        <p className="mt-1.5 truncate text-xs text-gray-500">
          By {campaign.fundraiser_name}
        </p>


        {/* =================================================
            PROGRESS
        ================================================== */}
        <div className="mt-4">

          {/* Progress bar */}
          <div className="h-[10px] overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-[#01A14B] transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>


          {/* Raised + Percentage */}
          <div className="mt-2.5 flex items-center justify-between">

            <div className="flex items-baseline gap-1">

              <span className="text-sm font-bold text-gray-950">
                ${Number(campaign.raised_amount).toLocaleString()}
              </span>

              <span className="text-sm text-gray-950">
                raised
              </span>

            </div>


            <span className="text-sm font-semibold text-gray-950">
              {progress}%
            </span>

          </div>

        </div>


        {/* GOAL */}
        <div className="mt-1.5 flex items-center justify-between">

          <span className="text-[10px] text-gray-400">
            Goal ${Number(campaign.goal).toLocaleString()}
          </span>

          {progress >= 100 && (
            <span className="text-[10px] font-bold text-[#01A14B]">
              Goal reached
            </span>
          )}

        </div>

      </div>

    </Link>
  );
}