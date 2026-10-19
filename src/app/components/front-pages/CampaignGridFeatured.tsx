"use client";

import { useEffect, useState } from "react";
import CampaignCard from "@/app/components/front-pages/CampaignCard";
import { getCampaigns, type Campaign } from "@/lib/campaigns";
import { Icon } from "@iconify/react";

export default function CampaignGridFeatured() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to track the current slide (chunk of 5)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCampaigns() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetching up to 15 campaigns (3 slides of 5)
        const response = await getCampaigns({
          page: 1,
          per_page: 15, 
          status: "launched-and-beyond",
          is_featured: true,
        });

        if (!cancelled) {
          if (response.success) {
            const campaignsWithCompletedCounts = await Promise.all(
              response.data.map(async (campaign) => {
                try {
                  const donationResponse = await fetch(
                    `/api/campaigns/${campaign.id}/donations`,
                    {
                      method: "GET",
                      cache: "no-store",
                    }
                  );

                  const donationData = await donationResponse.json();

                  if (donationResponse.ok && donationData?.success) {
                    return {
                      ...campaign,
                      number_of_contributions: Number(
                        donationData.completed_count ?? 0
                      ),
                    };
                  }
                } catch (error) {
                  console.error(
                    `Failed to load completed donation count for campaign ${campaign.id}:`,
                    error
                  );
                }

                return campaign;
              })
            );

            if (!cancelled) {
              setCampaigns(campaignsWithCompletedCounts);
            }
          } else {
            setCampaigns([]);
            setError("Failed to load campaigns.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch campaigns:", err);
          setCampaigns([]);
          setError(
            err instanceof Error ? err.message : "Failed to load campaigns."
          );
        }
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
        No featured campaigns found.
      </div>
    );
  }

  // Split campaigns into chunks of 5
  const chunkedCampaigns = [];
  for (let i = 0; i < campaigns.length; i += 5) {
    chunkedCampaigns.push(campaigns.slice(i, i + 5));
  }

  // Navigation Handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, chunkedCampaigns.length - 1));
  };

  return (
    <div className="lg:py-24 py-12 dark:bg-dark">
      <div className="container-1218 mx-auto px-4">
        
        {/* --- HEADER WITH NAVIGATION --- */}
        {/* FIXED: Uses flex-row justify-between on all screens so buttons are always top right */}
        <div className="mb-8 flex flex-row items-center justify-between gap-4 sm:mb-10 sm:items-end">
          <div className="text-left">
            <h2 className="text-2xl font-bold leading-tight text-dark dark:text-white sm:text-3xl sm:leading-[1.2] lg:text-[44px]">
              Explore <span className="text-primary">Featured</span> <br className="hidden sm:block" />
              Campaigns
            </h2>
          </div>

          {/* Navigation Arrows */}
          {chunkedCampaigns.length > 1 && (
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Previous campaigns"
              >
                <Icon icon="solar:arrow-left-linear" className="text-lg sm:text-xl" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === chunkedCampaigns.length - 1}
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Next campaigns"
              >
                <Icon icon="solar:arrow-right-linear" className="text-lg sm:text-xl" />
              </button>
            </div>
          )}
        </div>

       {/* --- SLIDING CAROUSEL WRAPPER --- */}
        <div className="relative -mx-4 overflow-hidden px-4 py-4">
          <div 
            className="flex w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {chunkedCampaigns.map((group, groupIndex) => {
              const featuredCampaign = group[0];
              const regularCampaigns = group.slice(1, 5);

              return (
                <div key={groupIndex} className="flex w-full shrink-0 flex-col lg:flex-row gap-8 items-stretch px-4">
                  
                  {/* LEFT SIDE: 1 Big Card (Removed extra div wrapper so it stretches) */}
                  <div className="w-full lg:w-1/2 flex">
                    {featuredCampaign && (
                      <CampaignCard campaign={featuredCampaign} />
                    )}
                  </div>

                  {/* RIGHT SIDE: 4 Small Cards (Removed extra div wrapper so they stretch) */}
                  {regularCampaigns.length > 0 && (
                    <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {regularCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                      ))}
                    </div>
                  )}
                  
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}