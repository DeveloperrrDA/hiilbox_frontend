
"use client";

import CampaignCard from "@/app/components/front-pages/CampaignCard";
import type { Campaign } from "@/lib/campaigns";

export default function CampaignCards({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
        />
      ))}
    </div>
  );
}
