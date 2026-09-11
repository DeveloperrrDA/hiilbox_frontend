import Link from "next/link";

import { getCampaign, getCampaignRecentDonations } from "@/lib/campaigns";
import { Icon } from "@iconify/react";
import ShareCampaign from "@/components/ShareCampaign";
import ThemeShell from "@/components/theme/ThemeShell";


interface CampaignPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ 
    tab?: string 
  }>;
}

const CampaignTabs = ({ 
  activeTab, 
  campaign 
}: { 
  activeTab: string; 
  campaign: any; 
}) => {
  return (
    <>
      {/* --- TABS NAVIGATION --- */}
      <div className="flex flex-row items-center justify-between content-center">
        <div className="overflow-x-auto base2/3">
          <div className="flex shrink-0 gap-4 md:pb-14 py-4">
            <Link
              href="?tab=story"
              className={`py-4 px-6 whitespace-nowrap w-full rounded-xl text-base font-semibold text-center flex gap-2 justify-center items-center md:hover:bg-lightprimary shadow-elevation2 ${
                activeTab === "story"
                  ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                  : "dark:text-white bg-white dark:bg-dark text-dark"
              }`}
            >
              <Icon icon="material-symbols:article-outline-rounded" height={22} />
              Story
            </Link>

            <Link
              href="?tab=faqs"
              className={`py-4 px-6 whitespace-nowrap w-full rounded-xl text-base font-semibold text-center flex gap-2 justify-center items-center md:hover:bg-lightprimary shadow-elevation2 ${
                activeTab === "faqs"
                  ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                  : "dark:text-white bg-white dark:bg-dark text-dark"
              }`}
            >
              <Icon icon="material-symbols:help-outline-rounded" height={22} />
              FAQs
            </Link>

            <Link
              href="?tab=updates"
              className={`py-4 px-6 whitespace-nowrap w-full rounded-xl text-base font-semibold text-center flex gap-2 justify-center items-center md:hover:bg-lightprimary shadow-elevation2 ${
                activeTab === "updates"
                  ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                  : "dark:text-white bg-white dark:bg-dark text-dark"
              }`}
            >
              <Icon icon="material-symbols:campaign-outline-rounded" height={22} />
              Updates
            </Link>

            <Link
              href="?tab=comments"
              className={`py-4 px-6 whitespace-nowrap w-full rounded-xl text-base font-semibold text-center flex gap-2 justify-center items-center md:hover:bg-lightprimary shadow-elevation2 ${
                activeTab === "comments"
                  ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                  : "dark:text-white bg-white dark:bg-dark text-dark"
              }`}
            >
              <Icon icon="material-symbols:chat-bubble-outline-rounded" height={22} />
              Comments
            </Link>
            
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <Link
              href={`/checkout?campaign=${campaign.id}&title=${encodeURIComponent(
                campaign.title
              )}`}
              className="my-4 block w-full rounded-full bg-transparent border border-grey-500 px-6 py-3.5 text-center text-sm font-semibold text-grey-500 transition-colors"
            >
              Donate to this campaign
          </Link>
        </div>
      </div>
      {/* --- TABS CONTENT --- */}
      <div className="grid grid-cols-12 gap-7">
        {activeTab === "story" && (
          <div className="col-span-12">
            <p className="whitespace-pre-line text-base leading-8 border-t border-[#e0e6eb] pt-4 text-[#5a6a85]">
              {campaign.story || "No story available."}
            </p>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="col-span-12">
            <p className="whitespace-pre-line text-base leading-8 border-t border-[#e0e6eb] pt-4 text-[#5a6a85]">
              FAQ Section
            </p>
          </div>
        )}
        
        {activeTab === "updates" && (
          <div className="col-span-12">
            <p className="whitespace-pre-line text-base leading-8 border-t border-[#e0e6eb] pt-4 text-[#5a6a85]">
              Updates Section
            </p>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="col-span-12">
            <p className="py-4 whitespace-pre-line text-base leading-8 border-t border-[#e0e6eb] pt-4 text-[#5a6a85]">
              Comments Section
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default async function CampaignPage({
  params,
  searchParams,
}: CampaignPageProps) {

  

  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const activeTab = resolvedSearchParams.tab || "story";

  const campaignId = Number(id);
  const [response, recentDonations] = await Promise.all([
    getCampaign(campaignId),
    getCampaignRecentDonations(campaignId),
  ]);

  if (!response.success || !response.data) {
    return (
      <ThemeShell>
      <main className="min-h-[60vh] bg-[#f8fafd]">
        <div className="mx-auto max-w-[1218px] px-6 py-10">
          <Link
            href="/campaigns"
            className="text-sm font-medium text-[#5a6a85] transition-colors hover:text-[#01A14B]"
          >
            ← Back to campaigns
          </Link>

          <div className="mt-10 rounded-[16px] bg-[#f8fafd] p-10">
            <h1 className="text-2xl font-bold text-[#111c2d]">
              Campaign not found
            </h1>

            <p className="mt-2 text-[#5a6a85]">
              This campaign could not be found.
            </p>
          </div>
        </div>
      </main>
      </ThemeShell>
    );
  }

  const campaign = response.data;

  const progress =
    campaign.goal > 0
      ? Math.min(
          100,
          Math.round(
            (campaign.raised_amount / campaign.goal) * 100
          )
        )
      : 0;

    // --- ADD THIS SVG MATH HERE ---
    const size = 100; // Adjust size of the circle here
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    // ------------------------------

  const deadline = campaign.deadline
    ? new Date(campaign.deadline).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
    : null;

  const fundraiserName =
    campaign.fundraiser_name?.trim() ||
    "Anonymous fundraiser";

  const fundraiserInitial =
    fundraiserName.charAt(0).toUpperCase();

  const imageUrl =
    campaign.image_url ||
    campaign.images?.[0]?.url ||
    campaign.images?.[0]?.sizes?.medium?.url ||
    campaign.images?.[0]?.sizes?.woocommerce_thumbnail?.url ||
    "";


  return (
    <ThemeShell>
    <main className="min-h-screen bg-white">
      {/* ================= TOP ================= */}

      <div className="bg-white"><div className="mx-auto max-w-[1218px] px-6 py-4">
        <Link
          href="/campaigns"
          className="text-sm font-medium text-[#5a6a85] transition-colors hover:text-[#01A14B]"
        >
          ← Back to campaigns
        </Link>
      </div>

      {/* ================= IMAGE ================= */}

      <div className="mx-auto mt-6 max-w-[1218px] px-6">
        
      </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="mx-auto max-w-[1218px] px-6 py-10">
        
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* ================= STORY ================= */}

          <div>
            {/* Title */}
            <h1 className="mb-6 text-xl font-bold leading-tight tracking-tight text-[#111c2d] sm:text-2xl">
              {campaign.title}
            </h1>
            <div className="relative aspect-[16/7] overflow-hidden rounded-[16px] bg-gray-100 mb-10">
            
          {imageUrl ? (
            // Use the already-normalized campaign URL directly here. The
            // campaign cards use the same URL successfully; avoiding the
            // Next image pipeline on this server-rendered detail page also
            // avoids remote-image/proxy differences between the two views.
            <img
              src={imageUrl}
              alt={campaign.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>
            {/* Fundraiser */}

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f6ed] text-sm font-bold text-[#01A14B]">
                {fundraiserInitial}
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Fundraiser
                </p>

                <p className="text-sm font-semibold text-[#111c2d]">
                  {fundraiserName}
                </p>
              </div>
            </div>

            {/* Share */}
              <ShareCampaign title={campaign.title} />
          </div>

          {/* ================= DONATION SIDEBAR ================= */}

          <aside>
            <div className="sticky top-28">
              <div className="rounded-[16px] bg-white p-6 shadow-[0_0px_25px_rgba(17,28,45,0.08)] ring-1 ring-[#e0e6eb]">

                {/* Raised */}

                <div className="flex flex-row items-center justify-between gap-4">
                  {/* Progress */}

                  <div className="relative basis-1/2 flex items-center justify-center content-ccenter w-24 h-24">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox={`0 0 ${size} ${size}`}
                    >
                      {/* Background Track Circle */}
                      <circle
                        className="text-gray-100 dark:text-gray-800"
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                      />

                      {/* Progress Circle */}
                      <circle
                        className="text-[#01A14B]"
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

                    {/* Center Text */}
                    <span className="absolute text-base font-semibold text-gray-700 dark:text-gray-300">
                      {progress}%
                    </span>
                  </div>
                  <div className="basis-2/3">
                    <p className="text-xl/6 font-bold tracking-tight text-[#111c2d]">
                      ${campaign.raised_amount.toLocaleString()} raised of 
                    </p>

                    <p className="mt-1 text-2xl/6 text-[#5a6a85]">
                       ${campaign.goal.toLocaleString()}USD
                    </p>
                    <p className="mt-1 text-sm/4 text-[#5a6a85]">
                       {campaign.number_of_contributions.toLocaleString()} Donations
                    </p>
                  </div>

                  
                </div>

                {/* Donate */}

                <Link
                  href={`/checkout?campaign=${campaign.id}&title=${encodeURIComponent(
                    campaign.title
                  )}`}
                  className="mt-7 block w-full rounded-full bg-[#01A14B] px-6 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-[#018d42]"
                >
                  Donate
                </Link>

                {/* Share */}

                <Link
                  href={`#`}
                  className="mt-3 block w-full rounded-full bg-[#01A14B] px-6 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-[#018d42]"
                >
                  Share
                </Link>

                {/* Recent Donations */}
                <div className="mt-6 flex flex-row items-center content-center gap-2">
                  <Icon
                    icon="tabler:trending-up"
                    className="text-4xl font-bold shrink-0 text-purple-500 bg-purple-500/10 rounded-full p-2"
                  />
                  <p className="mt-1 text-base text-purple-500">
                    Recent Donations
                  </p>
                </div>

                <div className="mt-4 max-h-[420px] overflow-y-auto pr-1">
                  {recentDonations.length ? (
                    <div className="divide-y divide-gray-100">
                      {recentDonations.map((donation, index) => (
                        <div key={`${donation.id ?? "donation"}-${index}`} className="py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-[#111c2d]">
                              {donation.is_anonymous ? "Anonymous" : donation.donor_name || "Anonymous"}
                            </p>
                            <p className="text-sm font-semibold text-[#01A14B]">
                              {donation.currency ? `${donation.currency} ` : "$"}{Number(donation.amount || 0).toLocaleString()}
                            </p>
                          </div>
                          {donation.created_at && (
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-4 text-sm text-gray-400">No donations yet.</p>
                  )}
                </div>
                

                {deadline && (
                  <p className="mt-6 text-center text-xs text-gray-400">
                    Campaign ends {deadline}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="mx-auto max-w-[1218px] px-6 py-10">
        <CampaignTabs activeTab={activeTab} campaign={campaign} />
      </div>
    </main>
    </ThemeShell>
  );

}