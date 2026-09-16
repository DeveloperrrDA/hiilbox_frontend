import Link from "next/link";

import { getCampaign, getCampaignRecentDonations } from "@/lib/campaigns";
import ShareCampaign from "@/components/ShareCampaign";
import ThemeShell from "@/components/theme/ThemeShell";

interface CampaignPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CampaignPage({
  params,
}: CampaignPageProps) {
  const { id } = await params;

  const campaignId = Number(id);
  const [response, fetchedDonations] = await Promise.all([
    getCampaign(campaignId),
    getCampaignRecentDonations(campaignId),
  ]);

  if (!response.success || !response.data) {
    return (
      <ThemeShell>
      <main className="min-h-[60vh] bg-[#f8fafd]">
        <div className="mx-auto max-w-[1218px] px-6 py-12">
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
  const recentDonations = fetchedDonations.length
    ? fetchedDonations
    : campaign.recent_donations ?? [];

  const progress =
    campaign.goal > 0
      ? Math.min(
          100,
          Math.round(
            (campaign.raised_amount / campaign.goal) * 100
          )
        )
      : 0;

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
    <main className="min-h-screen bg-[#f8fafd]">
      {/* ================= TOP ================= */}

      <div className="relative overflow-hidden bg-[#f8fafd]">
        <div className="pointer-events-none absolute -right-28 top-8 h-72 w-72 rounded-full bg-[#01A14B]/[0.06]" />
        <div className="pointer-events-none absolute -left-32 top-40 h-64 w-64 rounded-full bg-[#111c2d]/[0.035]" />
        <div className="relative mx-auto max-w-[1218px] px-6 pt-8">
        <Link
          href="/campaigns"
          className="text-sm font-medium text-[#5a6a85] transition-colors hover:text-[#01A14B]"
        >
          ← Back to campaigns
        </Link>
      </div>

      {/* ================= IMAGE ================= */}

      <div className="mx-auto mt-6 max-w-[1218px] px-6">
        <div className="relative aspect-[16/7] overflow-hidden rounded-[20px] border border-white/70 bg-gray-100 shadow-[0_18px_45px_rgba(17,28,45,0.10)]">
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
        <div className="mt-6 flex items-center gap-3 pb-10">
          <span className="h-1.5 w-12 rounded-full bg-[#01A14B]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5a6a85]">Community powered fundraising</span>
        </div>
      </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="mx-auto max-w-[1218px] px-6 py-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* ================= STORY ================= */}

          <div className="rounded-[20px] border border-[#e0e6eb] bg-white p-6 shadow-[0_12px_32px_rgba(17,28,45,0.05)] sm:p-8">
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

            {/* Title */}

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-[#111c2d] sm:text-4xl">
              {campaign.title}
            </h1>

            {/* Story */}

            <section className="mt-10 rounded-[16px] bg-[#f8fafd] p-6">
              <h2 className="text-xl font-bold text-[#111c2d]">
                About this campaign
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#5a6a85]">
                {campaign.description}
              </p>
            </section>

            {/* Campaign information */}

            <section className="mt-10 rounded-[16px] border border-[#e0e6eb] p-6">
              <h2 className="text-lg font-bold text-[#111c2d]">
                Campaign information
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-gray-400">
                    Fundraiser
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#111c2d]">
                    {fundraiserName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Goal
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#111c2d]">
                    ${campaign.goal.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Raised
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#111c2d]">
                    ${campaign.raised_amount.toLocaleString()}
                  </p>
                </div>

                {deadline && (
                  <div>
                    <p className="text-xs text-gray-400">
                      Deadline
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#111c2d]">
                      {deadline}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-medium capitalize text-[#111c2d]">
                    {campaign.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Contributors
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#111c2d]">
                    {campaign.number_of_contributors.toLocaleString()}
                  </p>
                </div>

              </div>
            </section>

          </div>

          {/* ================= DONATION SIDEBAR ================= */}

          <aside>
            <div className="sticky top-28">
              <div className="relative overflow-hidden rounded-[24px] border border-[#dfe5df] bg-white p-6 shadow-[0_16px_40px_rgba(17,28,45,0.08)] sm:p-7">
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-[#01A14B]">
                  Campaign progress
                </p>

                <div className="flex items-center gap-5">
                  <div className="relative h-24 w-24 shrink-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-label={`${progress}% funded`}>
                      <circle cx="60" cy="60" r="48" fill="none" stroke="#edf2ed" strokeWidth="12" />
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="#52b946"
                        strokeWidth="12"
                        strokeLinecap="round"
                        pathLength="100"
                        strokeDasharray="100"
                        strokeDashoffset={100 - progress}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-extrabold text-[#111c2d]">{progress}%</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[30px] font-extrabold leading-none tracking-tight text-[#111c2d]">
                      ${campaign.raised_amount.toLocaleString()} raised
                    </p>
                    <p className="mt-2 text-lg text-[#667085]">
                      of ${campaign.goal.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-[#667085]">
                      {Math.max(campaign.number_of_contributions, recentDonations.length).toLocaleString()} donations
                    </p>
                  </div>
                </div>

                <Link
                  href={`/checkout?campaign=${campaign.id}&title=${encodeURIComponent(campaign.title)}`}
                  className="mt-7 block w-full rounded-full bg-[#bdf77a] px-6 py-4 text-center text-base font-extrabold text-[#214c32] transition hover:bg-[#aef064]"
                >
                  Donate to this campaign
                </Link>

                <div className="mt-6 border-t border-[#edf0ed] pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-extrabold text-[#8e35a8]">Recent donations</h2>
                      <p className="mt-1 text-xs text-[#667085]">
                        {recentDonations.length
                          ? `${recentDonations.length.toLocaleString()} donations · newest first`
                          : "Be the first to support this campaign."}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1d8f7] text-lg font-bold text-[#8e35a8]">↗</div>
                  </div>

                  <div className="mt-4 max-h-[420px] overflow-y-auto overscroll-contain divide-y divide-[#edf0ed] pr-2 [scrollbar-gutter:stable]">
                    {recentDonations.length ? (
                      recentDonations.map((donation) => {
                        const name = donation.is_anonymous ? "Anonymous" : donation.donor_name || "Supporter";
                        const initial = name.charAt(0).toUpperCase();
                        const when = donation.created_at
                          ? new Date(donation.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: new Date(donation.created_at).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                            })
                          : null;
                        const currencySymbol = donation.currency === "USD" ? "$" : `${donation.currency} `;

                        return (
                          <div key={donation.id} className="flex items-center gap-3 py-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f6f5] text-sm font-bold text-[#111c2d]">
                              {donation.is_anonymous ? "♡" : initial}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#111c2d]">{name}</p>
                              <p className="mt-0.5 text-sm text-[#667085]">
                                <span className="font-extrabold text-[#111c2d]">{currencySymbol}{donation.amount.toLocaleString()}</span>
                                {when ? ` · ${when}` : ""}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="py-6 text-center text-sm text-[#667085]">No recent donations yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-2 border-t border-[#edf0ed] pt-5">
                  <ShareCampaign title={campaign.title} />
                </div>

                {deadline && (
                  <p className="mt-5 text-center text-xs text-gray-400">
                    Campaign ends {deadline}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
    </ThemeShell>
  );
}