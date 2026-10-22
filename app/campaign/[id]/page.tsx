import Link from "next/link";

import {
  getCampaign,
  getCampaigns,
  getCampaignRecentDonations,
  getCampaignUpdates
} from "@/lib/campaigns";
import { type CampaignUpdate } from "@/lib/campaigns";

import { Icon } from "@iconify/react";
import ShareCampaign from "@/components/ShareCampaign";
import ThemeShell from "@/components/theme/ThemeShell";
import CampaignComments from "@/components/CampaignComments";
import CampaignMediaSlider from "@/components/CampaignMediaSlider";
import CampaignRecentDonations from "@/components/CampaignRecentDonations";
import MobileStickyCTA from "@/components/MobileStickyCTA";
interface CampaignPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

const CampaignTabs = ({ 
  activeTab, 
  campaign,
  campaignUpdates 
}: { 
  activeTab: string; 
  campaign: any;
  campaignUpdates: any[]; 
}) => {
  return (
    <div className="w-full">
      
      {/* --- TABS NAVIGATION --- */}
      {/* FIXED: Uses a 2-column grid on mobile so tabs wrap cleanly, then becomes a row on md+ screens */}
      <div className="grid grid-cols-2 gap-3 pb-6 pt-4 md:flex md:flex-row md:flex-wrap md:gap-4 md:pb-14">
        
        <Link
          href="?tab=story"
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
            activeTab === "story"
              ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
              : "bg-white text-dark dark:bg-dark dark:text-white"
          }`}
        >
          <Icon icon="material-symbols:article-outline-rounded" className="text-base md:text-[22px]" />
          Story
        </Link>

        <Link
          href="?tab=faqs"
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
            activeTab === "faqs"
              ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
              : "bg-white text-dark dark:bg-dark dark:text-white"
          }`}
        >
          <Icon icon="material-symbols:help-outline-rounded" className="text-base md:text-[22px]" />
          FAQs
        </Link>

        <Link
          href="?tab=updates"
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
            activeTab === "updates"
              ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
              : "bg-white text-dark dark:bg-dark dark:text-white"
          }`}
        >
          <Icon icon="material-symbols:campaign-outline-rounded" className="text-base md:text-[22px]" />
          Updates
        </Link>

        <Link
          href="?tab=comments"
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
            activeTab === "comments"
              ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
              : "bg-white text-dark dark:bg-dark dark:text-white"
          }`}
        >
          <Icon icon="material-symbols:chat-bubble-outline-rounded" className="text-base md:text-[22px]" />
          Comments
        </Link>

      </div>

      {/* --- TABS CONTENT --- */}
      {/* FIXED: Removed grid-cols-12 which can cause blowout. Added break-words to handle long strings/URLs */}
      <div className="w-full">
        
        {activeTab === "story" && (
          <div className="w-full border-t border-[#e0e6eb] pt-6">
            <p className="whitespace-pre-line break-words text-base leading-8 text-[#5a6a85]">
              {campaign.story || "No story available."}
            </p>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="w-full border-t border-[#e0e6eb] pt-6">
            <p className="whitespace-pre-line break-words text-base leading-8 text-[#5a6a85]">
              FAQ Section
            </p>
          </div>
        )}

        {activeTab === "updates" && (
          <div className="w-full">
            {/* Updates Header */}
            <div className="mb-8 flex items-center gap-3 border-t border-[#e0e6eb] pt-8">
              <h2 className="text-2xl font-bold text-dark dark:text-white">Updates</h2>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-700">
                {campaignUpdates?.length || 0}
              </span>
            </div>

            <div className="space-y-12">
              {campaignUpdates?.map((update) => (
                <div key={update.id} className="flex w-full flex-col max-w-full">
                  
                  {/* AUTHOR & META ROW */}
                  <div className="mb-5 flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                      {update.created_by_image ? (
                        <img
                          src={update.created_by_image}
                          alt={update.created_by_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-bold uppercase text-gray-500">
                          {update.created_by_name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>

                    {/* Meta Info (Added min-w-0 flex-1 to prevent text blowout) */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-dark dark:text-white">
                          {new Date(update.created_at).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </span>
                        
                        {/* Green "NEW" Badge */}
                       {(() => {
  const createdTime = new Date(update.created_at).getTime();

  const isNew =
    Number.isFinite(createdTime) &&
    createdTime <= Date.now() &&
    Date.now() - createdTime < 7 * 24 * 60 * 60 * 1000;

  return isNew ? (
    <span className="rounded bg-[#dcfce7] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-green-700 uppercase">
      New
    </span>
  ) : null;
})()}
                      </div>
                      <div className="truncate text-sm text-[#5a6a85]">
                        {update.created_by_name} <span className="mx-1">•</span> {update.created_by_role}
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <h3 className="mb-3 break-words text-lg font-bold text-dark dark:text-white">
                    {update.title}
                  </h3>

                  <div className="w-full text-base leading-8 text-[#5a6a85]">
                    <p className="line-clamp-4 break-words whitespace-pre-line">
                      {update.description}
                    </p>
                  </div>

                  <button className="mt-3 w-max text-left font-medium text-dark underline underline-offset-4 hover:text-primary dark:text-white">
                    Read more
                  </button>
                </div>
              ))}

              {(!campaignUpdates || campaignUpdates.length === 0) && (
                <p className="pt-4 text-[#5a6a85]">No updates posted yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="w-full border-t border-[#e0e6eb] pt-6">
            {/* <CampaignComments campaignId={Number(campaign.id)} /> */}
          </div>
        )}

      </div>
    </div>
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

let campaignUpdatesResponse: Awaited<
  ReturnType<typeof getCampaignUpdates>
> = {
  success: true,
  data: [],
  pagination: {
    page: 1,
    per_page: 10,
  },
};

try {
  campaignUpdatesResponse = await getCampaignUpdates({
    page: 1,
    per_page: 10,
    campaign_id: campaignId,
  });
} catch (error) {
  console.error(
    `Unable to load updates for campaign ${campaignId}:`,
    error
  );
}


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
const extractedUpdates = campaignUpdatesResponse.data;

// Related campaigns are optional: failure must never break the main page.
let relatedCampaigns: Awaited<ReturnType<typeof getCampaigns>>["data"] = [];

try {
  const relatedResponse = await getCampaigns({
    page: 1,
    per_page: 24,
    status: "launched-and-beyond",
  });

  const eligible = relatedResponse.data.filter(
    (item) =>
      item.id !== campaign.id &&
      item.id > 0 &&
      !item.is_hidden &&
      !item.is_paused &&
      !item.is_ended
  );

  // Prefer the same category, then other eligible campaigns.
  relatedCampaigns = eligible
    .sort((a, b) => {
      const aMatch =
        Boolean(campaign.category) &&
        a.category === campaign.category ? 1 : 0;

      const bMatch =
        Boolean(campaign.category) &&
        b.category === campaign.category ? 1 : 0;

      return bMatch - aMatch;
    })
    .slice(0, 4);
} catch (error) {
  console.error("Unable to load related campaigns:", error);
}

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

          <div className="min-w-0">
            {/* Title */}
            <h1 className="mb-6 text-xl font-bold leading-tight tracking-tight text-[#111c2d] sm:text-2xl">
              {campaign.title}
            </h1>
            <CampaignMediaSlider
              video={campaign.video}
              images={campaign.images}
              title={campaign.title}
              fallbackImage={imageUrl}
            />            

            {/* =======================================================
                  MOBILE-ONLY DONATE OVERVIEW (Under Slider)
              ======================================================= */}
              <div id="mobile-donate-section" className="mt-8 block rounded-[16px] bg-white p-5 shadow-[0_0px_25px_rgba(17,28,45,0.08)] ring-1 ring-[#e0e6eb] lg:hidden">
                <div className="flex flex-row items-center gap-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                      <circle className="text-gray-100 dark:text-gray-800" stroke="currentColor" fill="transparent" strokeWidth={strokeWidth} cx={size / 2} cy={size / 2} r={radius} />
                      <circle className="text-[#01A14B]" stroke="currentColor" fill="transparent" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} cx={size / 2} cy={size / 2} r={radius} />
                    </svg>
                    <span className="absolute text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {progress}%
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold tracking-tight text-[#111c2d]">
                      ${campaign.raised_amount.toLocaleString()} raised of 
                    </p>
                    <p className="text-xl font-medium text-[#5a6a85]">
                      ${campaign.goal.toLocaleString()}USD
                    </p>
                    <p className="mt-0.5 text-xs text-[#5a6a85]">
                      {recentDonations.length.toLocaleString()} Donations
                    </p>
                  </div>
                </div>

                {/* Mobile Action Buttons (Side by Side) */}
                <div className="mt-6 flex flex-row gap-3">
                  <Link
                    href={`/checkout?campaign=${campaign.id}&title=${encodeURIComponent(campaign.title)}`}
                    className="flex-1 rounded-full bg-primary py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary"
                  >
                    Donate
                  </Link>
                  <Link
                    href="#"
                    className="flex-1 rounded-full bg-lightprimary py-3.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Share
                  </Link>
                </div>
              </div>
              {/* ======================================================= */}

              <div className="mt-10 md:mt-0flex flex-wrap items-center sm:justify-between"> 
                {/* Fundraiser */}
              
                <div className="flex basis-full md:basis-1/2 flex-wrap items-center gap-3">
                  <div className=" flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f6ed] text-sm font-bold text-[#01A14B]">
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
                <div className="flex basis-full md:basis-1/2">
                  <ShareCampaign title={campaign.title} />
                </div>
              </div>
            <div className="py-10">
              <CampaignTabs activeTab={activeTab} campaign={campaign} campaignUpdates={extractedUpdates} />
            </div>
          </div>

          {/* ================= DONATION SIDEBAR ================= */}

          <aside id="mobile-donate-section" className="min-w-0">
            <div className="sticky top-28">
              <div className="rounded-[16px] bg-white p-6 shadow-[0_0px_25px_rgba(17,28,45,0.08)] ring-1 ring-[#e0e6eb]">

                {/* Raised */}
                <div className="hidden lg:block">
                  <div className="flex flex-row items-center gap-4">
                    {/* Progress */}

                    {/* FIXED: Removed basis-1/2 and content-ccenter. Added shrink-0 so it doesn't squish or stretch */}
                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
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

                    {/* FIXED: Removed basis-2/3. Added min-w-0 and flex-1 so it wraps text instead of blowing out screen width */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xl/6 font-bold tracking-tight text-[#111c2d]">
                        ${campaign.raised_amount.toLocaleString()} raised of 
                      </p>

                      <p className="mt-1 text-2xl/6 text-[#5a6a85]">
                        ${campaign.goal.toLocaleString()}USD
                      </p>
                      <p className="mt-1 text-sm/4 text-[#5a6a85]">
                        {recentDonations.length.toLocaleString()} Donations
                      </p>
                    </div>
                  </div>

                  {/* Donate */}

                  <Link
                    href={`/checkout?campaign=${campaign.id}&title=${encodeURIComponent(
                      campaign.title
                    )}`}
                    className="mt-7 block w-full rounded-full bg-primary px-6 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-primary hover:text-white"
                  >
                    Donate
                  </Link>

                  {/* Share */}

                  <Link
                    href={`#`}
                    className="mt-3 block w-full rounded-full bg-lightprimary px-6 py-3.5 text-center text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Share
                  </Link>
                </div>
                {/* Recent Donations */}
                <CampaignRecentDonations
                  initialDonations={recentDonations}
                  totalCount={recentDonations.length}
                />

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

      {/* ================= RELATED CAMPAIGNS ================= */}
      {relatedCampaigns.length > 0 && (
        <section className="border-t border-[#e0e6eb] bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[1218px] px-6">

            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#111c2d] dark:text-white">
                  Related Campaigns
                </h2>
                <p className="mt-2 text-sm text-[#5a6a85]">
                  Discover more causes you can support.
                </p>
              </div>

              <Link
                href="/campaigns"
                className="text-sm font-semibold text-[#01A14B] hover:underline"
              >
                View all campaigns →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCampaigns.map((item) => {
                const goal = Math.max(0, Number(item.goal) || 0);
                const raised = Math.max(0, Number(item.raised_amount) || 0);

                const percentage =
                  goal > 0
                    ? Math.min(100, Math.round((raised / goal) * 100))
                    : 0;

                return (
                  <Link
                    key={item.id}
                    href={`/campaigns/${item.id}`}
                    className="group overflow-hidden rounded-[16px] border border-[#e0e6eb] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(17,28,45,0.1)]"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#f8fafd]">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#5a6a85]">
                          Campaign image unavailable
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      {item.category && (
                        <p className="mb-2 text-xs font-semibold text-[#01A14B]">
                          {item.category}
                        </p>
                      )}

                      <h3 className="mb-4 line-clamp-2 min-h-[48px] text-base font-bold leading-6 text-[#111c2d] transition-colors group-hover:text-[#01A14B]">
                        {item.title}
                      </h3>

                      <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#e6f6ed]">
                        <div
                          className="h-full rounded-full bg-[#01A14B]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs text-[#5a6a85]">
                        <span>
                          <strong className="text-[#111c2d]">
                            ${raised.toLocaleString()}
                          </strong>{" "}
                          raised
                        </span>
                        <span>{percentage}%</span>
                      </div>

                      <p className="mt-2 text-xs text-[#5a6a85]">
                        Goal: ${goal.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
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
  lastDonationName={
    recentDonations[0]?.is_anonymous
      ? "Anonymous"
      : recentDonations[0]?.donor_name || "Anonymous"
  }
  lastDonationAmount={Number(recentDonations[0]?.amount || 0)}
/>
    </main>
    </ThemeShell>
  );

}