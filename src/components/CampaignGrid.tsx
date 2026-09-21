
"use client";

import { useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import { getCampaigns, type Campaign } from "@/lib/campaigns";

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
  per_page: 10,
  status: "published",
})
        if (!cancelled) {
          if (response.success) {
            setCampaigns(response.data);
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
            err instanceof Error
              ? err.message
              : "Failed to load campaigns."
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
        No campaigns found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

