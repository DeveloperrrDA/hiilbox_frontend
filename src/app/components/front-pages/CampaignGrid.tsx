"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CampaignCard from "@/app/components/front-pages/CampaignCard";
import { getCampaigns, type Campaign } from "@/lib/campaigns";
import { Button } from "@/components/ui/button";

export default function CampaignGrid() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
useEffect(() => {
  let cancelled = false;

  async function loadCampaigns() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getCampaigns({
        page: 1,
        per_page: 9,
        status: "launched-and-beyond",
      });

      if (cancelled) return;

      if (!response.success) {
        setCampaigns([]);
        setError("Failed to load campaigns.");
        return;
      }

      // Use counts already included in the campaign response.
      // No additional donation API requests.
      setCampaigns(response.data);
    } catch (err) {
      if (cancelled) return;

      console.error("Failed to fetch campaigns:", err);
      setCampaigns([]);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load campaigns."
      );
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }
  }

  loadCampaigns();

  return () => {
    cancelled = true;
  };
}, []);


  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading campaigns...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No campaigns found.
      </div>
    );
  }

  return (
    <div className="lg:py-24 py-12 dark:bg-dark">
      <div className="container-1218 mx-auto">
        <div className="lg:pt-24 pt-12 rounded-md overflow-hidden">
          <div className="flex w-full justify-center mb-12">
            <div className="text-center">
              <h2 className="sm:text-44 text-3xl font-bold leading-48px! text-darkgray dark:text-white text-center">
                Explore <span className="text-primary">Verified</span> Somali Crowdfunding Campaigns
              </h2>
              <p className="text-base leading-32px pt-4 text-darklink">
                Discover trusted Somali crowdfunding campaigns supporting
                health, education, emergencies, community projects, and charitable causes.
              </p>
            </div>
          </div>
        </div>
        
        {/* Campaign Grid (Limited to 9 via API) */}
        <div className="grid grid-cols-1 gap-6 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.slice(0, 9).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {/* See All Button Centered at Bottom */}
        <div className="mt-16 flex justify-center">
          <Button 
            asChild 
            className="rounded-full bg-[#01A14B] hover:bg-[#018b41] text-white shadow-sm px-10 py-6 text-base font-bold transition-transform hover:-translate-y-0.5"
          >
            <Link href="/campaigns">
              See all campaigns
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}