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
      <div className="flex items-stretch relative aspect-16/10 overflow-hidden rounded-[14px] bg-lightgray dark:bg-darkgray transition-all duration-500 ease-out group-hover:scale-[1.02]">

        {campaign.image_url ? (
          <Image
            src={campaign.image_url}
            alt={campaign.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-lightgray dark:bg-darkgray text-sm text-darkgray dark:text-white">
            No image available
          </div>
        )}

        {/* =================================================
            VERIFIED BADGE
        ================================================== */}
        <div className="absolute left-3 top-3 flex self-end items-center gap-1.5 rounded-full bg-lightgray/70 px-2.5 py-1.5 text-sm font-bold text-gray-800">

          

          {campaign.number_of_contributions}
          <span>
            Donations
          </span>

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="pt-4">

        {/* TITLE */}
        <div className="h-20">
          <h2 className="line-clamp-2 text-[20px] font-bold leading-5 text-darkgray dark:text-white transition-colors group-hover:text-primary sm:text-[18px]">
            {campaign.title}
          </h2>
        </div>
        
        {/* =================================================
            PROGRESS
        ================================================== */}
        <div className="mt-4">

          {/* Progress bar */}
          <div className="h-2.5 overflow-hidden rounded-full bg-darkgray/20 dark:bg-darkgray">

            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>


          {/* Raised + Percentage */}
          <div className="mt-2.5 flex items-center justify-between">

            <div className="flex items-baseline gap-1">

              <span className="text-base font-bold text-darkgray dark:text-white">
                ${Number(campaign.raised_amount).toLocaleString()}
              </span>

              <span className="text-base text-darkgray dark:text-white">
                raised
              </span>

            </div>


            <span className="text-base font-semibold text-darkgray dark:text-white">
              {progress}%
            </span>

          </div>

        </div>

      </div>

    </Link>
  );
}