import Link from "next/link";
import {
  getCampaign,
  getCampaigns,
  getCampaignRecentDonations,
  getCampaignUpdates
} from "@/lib/campaigns";
import ShareCampaign from "@/components/ShareCampaign";
import ThemeShell from "@/components/theme/ThemeShell";
import CampaignMediaSlider from "@/components/CampaignMediaSlider";
import CampaignRecentDonations from "@/components/CampaignRecentDonations";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import CampaignCard from "@/app/components/front-pages/CampaignCard";
import CampaignTabs from "@/components/CampaignTabs"; 

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignPage({
  params,
}: CampaignPageProps) {

  const { id } = await params;
  const campaignId = Number(id);

  const timed = async <T,>(name: string, request: Promise<T>): Promise<T> => {
    const start = performance.now();
    try { return await request; } 
    finally { console.log(`[CAMPAIGN PERFORMANCE] ${name}: ${Math.round(performance.now() - start)}ms`); }
  };

  const [response, updatesResult, relatedResult] = await Promise.all([
    timed("Campaign Details", getCampaign(campaignId)),
    timed("Campaign Updates", getCampaignUpdates({ page: 1, per_page: 10, campaign_id: campaignId }).catch(() => null)),
    timed("Related Campaigns", getCampaigns({ page: 1, per_page: 24, status: "launched-and-beyond" }).catch(() => null)),
  ]);

  const recentDonations: Awaited<ReturnType<typeof getCampaignRecentDonations>> = [];
  
  const campaignUpdatesResponse = updatesResult ?? {
    success: true,
    data: [],
    pagination: { page: 1, per_page: 10 },
  };

  if (!response.success || !response.data) {
    return (
      <ThemeShell>
        <main className="min-h-[60vh] bg-[#FAFAFA] dark:bg-darkgray transition-colors duration-300">
          <div className="mx-auto max-w-[1218px] px-6 py-10 dark:bg-darkgray">
            <Link href="/campaigns" className="text-sm font-medium text-[#5a6a85] dark:text-gray-400 transition-colors hover:text-[#01A14B]">
              ← Back to campaigns
            </Link>
            <div className="mt-10 rounded-[16px] bg-white dark:bg-dark p-10 border border-gray-100 dark:border-gray-800">
              <h1 className="text-2xl font-bold text-[#111c2d] dark:text-white">Campaign not found</h1>
              <p className="mt-2 text-[#5a6a85] dark:text-gray-400">This campaign could not be found.</p>
            </div>
          </div>
        </main>
      </ThemeShell>
    );
  }

  const campaign = response.data;
  const extractedUpdates = campaignUpdatesResponse.data;

  // --- Fetch Accurate Completed Donations Count ---
  let totalDonations = 0;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const donationResponse = await fetch(`${baseUrl}/api/campaigns/${campaign.id}/donations`, { cache: "no-store" });
    const donationData = await donationResponse.json();
    if (donationResponse.ok && donationData?.success) {
      totalDonations = Number(donationData.completed_count ?? 0);
    } else {
      totalDonations = Number(campaign.number_of_contributions ?? 0);
    }
  } catch (error) {
    console.error(`Failed to load completed donation count for campaign ${campaign.id}:`, error);
    totalDonations = Number(campaign.number_of_contributions ?? 0);
  }

  let relatedCampaigns: Awaited<ReturnType<typeof getCampaigns>>["data"] = [];
  try {
    const relatedResponse = relatedResult;
    if (!relatedResponse?.success || !Array.isArray(relatedResponse.data)) {
      throw new Error("Related campaigns unavailable");
    }

    const eligible = relatedResponse.data.filter(
      (item) => item.id !== campaign.id && item.id > 0 && !item.is_hidden && !item.is_paused && !item.is_ended
    );

    relatedCampaigns = eligible
      .sort((a, b) => {
        const aMatch = Boolean(campaign.category) && a.category === campaign.category ? 1 : 0;
        const bMatch = Boolean(campaign.category) && b.category === campaign.category ? 1 : 0;
        return bMatch - aMatch;
      })
      .slice(0, 4)
      .map((c) => ({ ...c, number_of_contributions: -1 })); 
  } catch (error) {
    console.error("Unable to load related campaigns:", error);
  }

  const progress = campaign.goal > 0 ? Math.min(100, Math.round((campaign.raised_amount / campaign.goal) * 100)) : 0;
  
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const deadline = campaign.deadline ? new Date(campaign.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;
  const fundraiserName = campaign.fundraiser_name?.trim() || "Anonymous fundraiser";
  const fundraiserInitial = fundraiserName.charAt(0).toUpperCase();
  const imageUrl = campaign.image_url || campaign.images?.[0]?.url || campaign.images?.[0]?.sizes?.medium?.url || campaign.images?.[0]?.sizes?.woocommerce_thumbnail?.url || "";

  return (
    <ThemeShell>
      <main className="min-h-screen bg-white dark:bg-darkgray transition-colors duration-300">
        
        {/* ================= TOP BACK BUTTON ================= */}
        <div className="bg-white dark:bg-darkgray">
          <div className="mx-auto max-w-[1218px] px-6 py-4">
            <Link href="/campaigns" className="text-sm font-medium text-[#5a6a85] transition-colors hover:text-[#01A14B] dark:text-gray-300">
              ← Back to campaigns
            </Link>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="mx-auto max-w-[1218px] px-6 pb-10 pt-4 lg:pt-10">
          
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            
            {/* ================= LEFT COLUMN (Story, Media, Mobile Flow) ================= */}
            <div className="min-w-0">
              
              <h1 className="mb-4 lg:mb-6 text-2xl lg:text-xl font-extrabold lg:font-bold leading-tight tracking-tight text-[#111c2d] dark:text-white sm:text-2xl">
                {campaign.title}
              </h1>

              <div className="-mx-6 mb-6 lg:mx-0 lg:mb-0">
                <CampaignMediaSlider video={campaign.video} images={campaign.images} title={campaign.title} fallbackImage={imageUrl} />
              </div>

              {/* Organizer & Share (Desktop unified style, Mobile order explicitly split below) */}
              <div className="hidden lg:flex mb-6 mt-10 flex-wrap items-center gap-y-5 sm:justify-between">
                <div className="flex basis-full flex-wrap items-center gap-3 md:basis-1/2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lightprimary dark:bg-primary/20 text-sm font-bold text-primary">
                    {fundraiserInitial}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fundraiser</p>
                    <p className="text-sm font-bold text-[#111c2d] dark:text-white">{fundraiserName}</p>
                  </div>
                </div>
                <div className="flex basis-full md:basis-1/2 md:justify-end dark:text-white">
                  <ShareCampaign title={campaign.title} />
                </div>
              </div>

              {/* ================= MOBILE ONLY FLOW ================= */}
              <div className="block lg:hidden min-w-0">
                
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lightprimary dark:bg-primary/20 text-sm font-bold text-primary">
                    {fundraiserInitial}
                  </div>
                  <p className="text-sm font-medium text-[#111c2d] dark:text-gray-300">
                    <span className="font-bold text-black dark:text-white">{fundraiserName}</span> is organizing this.
                  </p>
                </div>

                <div id="mobile-donate-section">
                  <div className="mb-6">
                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-[22px] font-extrabold text-[#111c2d] dark:text-white">${campaign.raised_amount.toLocaleString()}</span>
                      <span className="text-[15px] font-medium text-[#5a6a85] dark:text-gray-400">raised of ${campaign.goal.toLocaleString()} goal</span>
                    </div>
                    <div className="text-[13px] text-[#5a6a85] dark:text-gray-400 font-medium">
                      {totalDonations.toLocaleString()} donations
                    </div>
                  </div>

                  <div className="mb-6 flex gap-3">
                    <Link href="#" className="flex-1 rounded-xl bg-lightprimary dark:bg-primary/20 py-3.5 text-center text-[15px] font-bold text-primary dark:text-white transition-colors">
                      Share
                    </Link>
                    <Link href={`/checkout?campaign=${campaign.id}&title=${encodeURIComponent(campaign.title)}`} className="flex-1 rounded-xl bg-primary py-3.5 text-center text-[15px] font-bold text-white transition-colors hover:bg-primary/80">
                      Donate
                    </Link>
                  </div>

                  <div className="mb-8 dark:text-white">
                    <ShareCampaign title={campaign.title} />
                  </div>
                </div>

                <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                  <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-[#111c2d] dark:text-gray-300">
                    {campaign.story || "No story available for this campaign."}
                  </p>
                </div>

                <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                  <CampaignRecentDonations campaignId={campaignId} initialDonations={recentDonations} totalCount={totalDonations} />
                </div>

                {/* Mobile Tabs Wrapper (Story Hidden, Updates Default) */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                   <CampaignTabs campaign={campaign} campaignUpdates={extractedUpdates} hideStoryTab={true} />
                </div>

              </div>

              {/* ================= DESKTOP ONLY TABS ================= */}
              <div className="hidden lg:block py-10">
                <CampaignTabs campaign={campaign} campaignUpdates={extractedUpdates} />
              </div>

            </div>

            {/* ================= RIGHT COLUMN (Desktop Sidebar) ================= */}
            <aside id="desktop-donate-section" className="hidden lg:block min-w-0">
              <div className="sticky top-28 dark:bg-darkgray">
                <div className="rounded-[20px] bg-white dark:bg-dark p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex flex-row items-center gap-4">
                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                        <circle className="text-gray-100 dark:text-gray-800" stroke="currentColor" fill="transparent" strokeWidth={strokeWidth} cx={size / 2} cy={size / 2} r={radius} />
                        <circle className="text-primary" stroke="currentColor" fill="transparent" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} cx={size / 2} cy={size / 2} r={radius} />
                      </svg>
                      <span className="absolute text-base font-bold text-gray-800 dark:text-gray-200">{progress}%</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl/6 font-black tracking-tight text-[#111c2d] dark:text-white">
                        ${campaign.raised_amount.toLocaleString()} raised of 
                      </p>
                      <p className="mt-1 text-2xl/6 font-medium text-[#5a6a85] dark:text-gray-300">
                        ${campaign.goal.toLocaleString()}USD
                      </p>
                      <p className="mt-1 text-sm/4 font-medium text-[#5a6a85] dark:text-gray-400">
                        {totalDonations.toLocaleString()} Donations
                      </p>
                    </div>
                  </div>

                  <Link href={`/checkout?campaign=${campaign.id}&title=${encodeURIComponent(campaign.title)}`} className="mt-7 block w-full rounded-full bg-primary px-6 py-3.5 text-center text-base font-bold text-white transition-colors hover:bg-primary/80">
                    Donate
                  </Link>
                  <Link href={`#`} className="mt-3 block w-full rounded-full bg-lightprimary dark:bg-primary/20 px-6 py-3.5 text-center text-base font-bold text-primary dark:text-white transition-colors hover:bg-primary hover:text-white">
                    Share
                  </Link>

                  <CampaignRecentDonations campaignId={campaignId} initialDonations={recentDonations} totalCount={totalDonations} />
                  
                  {deadline && <p className="mt-6 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Campaign ends {deadline}</p>}
                </div>
              </div>
            </aside>

          </div>
        </div>

        {/* ================= RELATED CAMPAIGNS ================= */}
        {relatedCampaigns.length > 0 && (
          <section className="border-t border-[#e0e6eb] dark:border-gray-800 bg-[#FAFAFA] dark:bg-dark py-12 md:py-16">
            <div className="mx-auto max-w-[1218px] px-6">
              
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#111c2d] dark:text-white">
                    Related Campaigns
                  </h2>
                  <p className="mt-2 text-sm text-[#5a6a85] dark:text-gray-400">
                    Discover more causes you can support.
                  </p>
                </div>
                <Link href="/campaigns" className="text-sm font-semibold text-primary hover:underline">
                  View all campaigns →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {relatedCampaigns.map((item) => (
                  <CampaignCard key={item.id} campaign={item as any} />
                ))}
              </div>

            </div>
          </section>
        )}

        <MobileStickyCTA
          campaignId={campaign.id}
          title={campaign.title}
          progress={progress}
          raisedAmount={campaign.raised_amount}
          goalAmount={campaign.goal}
          lastDonationName={recentDonations[0]?.is_anonymous ? "Anonymous" : recentDonations[0]?.donor_name || "Anonymous"}
          lastDonationAmount={Number(recentDonations[0]?.amount || 0)}
        />
      </main>
    </ThemeShell>
  );
}