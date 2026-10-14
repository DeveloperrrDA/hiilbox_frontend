import { getCampaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/CampaignCard";
export const dynamic = "force-dynamic";
export default async function CampaignTestPage() {
  const response = await getCampaigns();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Campaign API Test
        </h1>

        <pre className="mb-10 overflow-auto rounded-lg bg-gray-100 p-4">
          {JSON.stringify(response, null, 2)}
        </pre>

        {response.success && response.data.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {response.data.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}