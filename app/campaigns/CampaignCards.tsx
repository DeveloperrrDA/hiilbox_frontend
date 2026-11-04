
"use client";

import { useEffect, useState } from "react";
import CampaignCard from "@/app/components/front-pages/CampaignCard";
import type { Campaign } from "@/lib/campaigns";

export default function CampaignCards({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const [completedCounts, setCompletedCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    let cancelled = false;
    setCompletedCounts({});

    // Same completed-donation endpoint used by the homepage.
    async function loadCompletedCounts() {
      await Promise.all(
        campaigns.map(async (campaign) => {
          try {
            const response = await fetch(
              `/api/campaigns/${campaign.id}/donations`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

            if (!response.ok) return;

            const data = await response.json();

            if (
              data?.success &&
              Number.isFinite(Number(data.completed_count)) &&
              data.completed_count != null
            ) {
              if (!cancelled) {
                setCompletedCounts((previous) => ({
                  ...previous,
                  [String(campaign.id)]: Number(data.completed_count),
                }));
              }
            }
          } catch (error) {
            console.error(
              `Failed to load completed donations for campaign ${campaign.id}:`,
              error
            );
          }
        })
      );
    }

    void loadCompletedCounts();

    return () => {
      cancelled = true;
    };
  }, [campaigns]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={{
            ...campaign,
            number_of_contributions:
              completedCounts[String(campaign.id)] ?? -1,
          }}
        />
      ))}
    </div>
  );
}
