"use client";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import CardBox from "@/app/components/shared/CardBox";
import { adminApi, dataFrom, rowsFrom } from "./adminApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";

/* -------------------------------------------------------------------------- */
/*                              Activity Constants                            */
/* -------------------------------------------------------------------------- */

const ACTIVITY_TYPES = {
  TIMELINE: "timeline",
  CAMPAIGN_SUBMITTED_FOR_REVIEW: "campaign-submitted-for-review",
  CAMPAIGN_RE_SUBMITTED_FOR_REVIEW: "campaign-re-submitted-for-review",
  CAMPAIGN_DECLINED: "campaign-declined",
  CAMPAIGN_APPROVED_AND_PUBLISHED: "campaign-approved-and-published",
  CAMPAIGN_SET_DEADLINE: "campaign-set-deadline",
  CAMPAIGN_REMOVED_DEADLINE: "campaign-removed-deadline",
  CAMPAIGN_EXTENDED_DEADLINE: "campaign-extended-deadline",
  CAMPAIGN_MARKED_AS_COMPLETED: "campaign-marked-as-completed",
  CAMPAIGN_POST_UPDATE: "campaign-post-update",
  CAMPAIGN_GOAL_REACHED: "campaign-goal-reached",
  CAMPAIGN_COMMENT: "commented-on-the-campaign",
  DONATION_CREATION: "donation-created",
  DONATION_CANCELLED: "donation-cancelled",
  DONATION_FAILED: "donation-failed",
  DONATION_COMPLETED: "donation-completed",
} as const;

type ActivityTone = "success" | "primary" | "warning" | "error" | "neutral";

interface ActivityVisual {
  icon: string;
  tone: ActivityTone;
  badgeLabel: string;
  message: ReactNode;
}

const TONE_STYLES: Record<
  ActivityTone,
  { ring: string; badge: string; highlight: string }
> = {
  success: {
    ring: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400",
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    highlight: "font-semibold text-emerald-600 dark:text-emerald-400",
  },
  primary: {
    ring: "bg-primary/10 text-primary ring-primary/20",
    badge: "bg-primary/10 text-primary",
    highlight: "font-semibold text-primary",
  },
  warning: {
    ring: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400",
    badge:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    highlight: "font-semibold text-amber-600 dark:text-amber-400",
  },
  error: {
    ring: "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400",
    badge:
      "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    highlight: "font-semibold text-rose-600 dark:text-rose-400",
  },
  neutral: {
    ring: "bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:bg-slate-400/15 dark:text-slate-300",
    badge:
      "bg-slate-500/10 text-slate-700 dark:bg-slate-400/15 dark:text-slate-300",
    highlight: "font-semibold text-foreground",
  },
};

function parseActivityDate(raw?: string | null): Date | null {
  if (!raw) return null;
  const normalized = raw.includes(" ") ? raw.replace(" ", "T") : raw;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return "—";
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) return "Just now";
  const mins = Math.round(diffSeconds / 60);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
  const hours = Math.round(diffSeconds / 3600);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(diffSeconds / 86400);
  if (Math.abs(days) < 7) return rtf.format(days, "day");
  const weeks = Math.round(diffSeconds / (86400 * 7));
  if (Math.abs(weeks) < 5) return rtf.format(weeks, "week");
  const months = Math.round(diffSeconds / (86400 * 30.44));
  if (Math.abs(months) < 12) return rtf.format(months, "month");
  const years = Math.round(diffSeconds / (86400 * 365.25));
  return rtf.format(years, "year");
}

function formatReadableDate(raw?: string | null): string {
  if (!raw) return "";
  const d = parseActivityDate(raw);
  if (!d) return String(raw);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCentsUsd(rawCents: any): string | null {
  const num = Number(rawCents);
  if (!Number.isFinite(num) || num <= 0) return null;
  const dollars = num / 100;
  return `$${dollars.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildActivityVisual(
  activity: any,
  kind: "donor" | "fundraiser",
  campaignTitleMap: Map<number, string>
): ActivityVisual {
  const type = String(activity?.type ?? "").trim().toLowerCase();
  const payload =
    typeof activity?.data === "string"
      ? (() => {
          try {
            return JSON.parse(activity.data);
          } catch {
            return null;
          }
        })()
      : activity?.data ?? {};

  const cid = Number(activity?.campaign_id ?? 0);
  const campaignTitle =
    activity?.campaign_title ||
    payload?.campaign_title ||
    (cid > 0 ? campaignTitleMap.get(cid) : null) ||
    (cid > 0 ? `Campaign #${cid}` : "a campaign");

  const quotedCampaign = (
    <span className="font-semibold text-foreground">“{campaignTitle}”</span>
  );

  const formattedAmount = formatCentsUsd(
    payload?.donation_amount ?? payload?.amount
  );

  const deadlineText = formatReadableDate(
    payload?.new_end_date ?? payload?.end_date ?? payload?.deadline
  );

  switch (type) {
    case ACTIVITY_TYPES.CAMPAIGN_APPROVED_AND_PUBLISHED:
      return {
        icon: "solar:verified-check-bold-duotone",
        tone: "success",
        badgeLabel: "Published",
        message: (
          <>
            Campaign {quotedCampaign} was{" "}
            <span className={TONE_STYLES.primary.highlight}>
              approved and published
            </span>
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_SUBMITTED_FOR_REVIEW:
      return {
        icon: "solar:document-add-bold-duotone",
        tone: "warning",
        badgeLabel: "In Review",
        message: (
          <>
            Submitted campaign {quotedCampaign}{" "}
            <span className={TONE_STYLES.warning.highlight}>for review</span>
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_RE_SUBMITTED_FOR_REVIEW:
      return {
        icon: "solar:refresh-circle-bold-duotone",
        tone: "warning",
        badgeLabel: "Resubmitted",
        message: (
          <>
            Resubmitted campaign {quotedCampaign}{" "}
            <span className={TONE_STYLES.warning.highlight}>for review</span>
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_DECLINED:
      return {
        icon: "solar:close-circle-bold-duotone",
        tone: "error",
        badgeLabel: "Declined",
        message: (
          <>
            Campaign {quotedCampaign} was{" "}
            <span className={TONE_STYLES.error.highlight}>declined</span>
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_SET_DEADLINE:
      return {
        icon: "solar:calendar-mark-bold-duotone",
        tone: "primary",
        badgeLabel: "Deadline Set",
        message: (
          <>
            Set deadline for {quotedCampaign}
            {deadlineText ? (
              <>
                {" "}
                to{" "}
                <span className={TONE_STYLES.primary.highlight}>
                  {deadlineText}
                </span>
              </>
            ) : null}
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_EXTENDED_DEADLINE:
      return {
        icon: "solar:calendar-add-bold-duotone",
        tone: "primary",
        badgeLabel: "Extended",
        message: (
          <>
            Extended deadline for {quotedCampaign}
            {deadlineText ? (
              <>
                {" "}
                to{" "}
                <span className={TONE_STYLES.primary.highlight}>
                  {deadlineText}
                </span>
              </>
            ) : null}
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_REMOVED_DEADLINE:
      return {
        icon: "solar:calendar-minimalistic-bold-duotone",
        tone: "neutral",
        badgeLabel: "Deadline Removed",
        message: <>Removed deadline from campaign {quotedCampaign}</>,
      };

    case ACTIVITY_TYPES.CAMPAIGN_MARKED_AS_COMPLETED:
      return {
        icon: "solar:flag-2-bold-duotone",
        tone: "success",
        badgeLabel: "Completed",
        message: (
          <>
            Campaign {quotedCampaign} was{" "}
            <span className={TONE_STYLES.success.highlight}>
              marked as completed
            </span>
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_POST_UPDATE:
      return {
        icon: "solar:megaphone-bold-duotone",
        tone: "primary",
        badgeLabel: "Update",
        message: <>Posted a new update on {quotedCampaign}</>,
      };

    case ACTIVITY_TYPES.CAMPAIGN_GOAL_REACHED:
      return {
        icon: "solar:cup-star-bold-duotone",
        tone: "success",
        badgeLabel: "Goal Reached",
        message: (
          <>
            Campaign {quotedCampaign}{" "}
            <span className={TONE_STYLES.success.highlight}>
              reached its fundraising goal!
            </span>
          </>
        ),
      };

    case ACTIVITY_TYPES.CAMPAIGN_COMMENT:
      return {
        icon: "solar:chat-round-dots-bold-duotone",
        tone: "primary",
        badgeLabel: "Comment",
        message: <>New comment posted on {quotedCampaign}</>,
      };

    case ACTIVITY_TYPES.DONATION_CREATION:
      return {
        icon: "solar:hand-heart-bold-duotone",
        tone: "success",
        badgeLabel: kind === "donor" ? "Donated" : "New Donation",
        message:
          kind === "donor" ? (
            <>
              Contributed{" "}
              {formattedAmount ? (
                <span className={TONE_STYLES.success.highlight}>
                  {formattedAmount}
                </span>
              ) : (
                "a donation"
              )}{" "}
              to {quotedCampaign}
            </>
          ) : (
            <>
              Received a{" "}
              {formattedAmount ? (
                <span className={TONE_STYLES.success.highlight}>
                  {formattedAmount}
                </span>
              ) : (
                "new"
              )}{" "}
              donation for {quotedCampaign}
            </>
          ),
      };

    case ACTIVITY_TYPES.DONATION_COMPLETED:
      return {
        icon: "solar:wallet-money-bold-duotone",
        tone: "success",
        badgeLabel: "Completed",
        message:
          kind === "donor" ? (
            <>
              Donation
              {formattedAmount ? (
                <>
                  {" "}
                  of{" "}
                  <span className={TONE_STYLES.success.highlight}>
                    {formattedAmount}
                  </span>
                </>
              ) : null}{" "}
              to {quotedCampaign} was completed
            </>
          ) : (
            <>
              Donation
              {formattedAmount ? (
                <>
                  {" "}
                  of{" "}
                  <span className={TONE_STYLES.success.highlight}>
                    {formattedAmount}
                  </span>
                </>
              ) : null}{" "}
              for {quotedCampaign} was completed
            </>
          ),
      };

    case ACTIVITY_TYPES.DONATION_CANCELLED:
      return {
        icon: "solar:close-square-bold-duotone",
        tone: "warning",
        badgeLabel: "Cancelled",
        message: (
          <>
            Donation
            {formattedAmount ? ` of ${formattedAmount}` : ""} for{" "}
            {quotedCampaign} was{" "}
            <span className={TONE_STYLES.warning.highlight}>cancelled</span>
          </>
        ),
      };

    case ACTIVITY_TYPES.DONATION_FAILED:
      return {
        icon: "solar:danger-triangle-bold-duotone",
        tone: "error",
        badgeLabel: "Failed",
        message: (
          <>
            Donation
            {formattedAmount ? ` of ${formattedAmount}` : ""} for{" "}
            {quotedCampaign}{" "}
            <span className={TONE_STYLES.error.highlight}>failed</span>
          </>
        ),
      };

    case ACTIVITY_TYPES.TIMELINE:
    default: {
      const readableType = type
        ? type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        : "Activity";
      return {
        icon: "solar:history-bold-duotone",
        tone: "neutral",
        badgeLabel: "Timeline",
        message: (
          <>
            {readableType} on {quotedCampaign}
          </>
        ),
      };
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                               Data Helpers                                 */
/* -------------------------------------------------------------------------- */

function donorId(d: any) {
  return Number(
    d?.donor?.id ??
      d?.donor?.ID ??
      d?.donor?.user_id ??
      d?.user?.id ??
      d?.user?.ID ??
      d?.donor_id ??
      d?.user_id ??
      0
  );
}

function donorEmail(d: any) {
  return String(
    d?.donor?.email ??
      d?.donor?.user_email ??
      d?.user?.email ??
      d?.user?.user_email ??
      d?.email ??
      d?.user_email ??
      ""
  )
    .trim()
    .toLowerCase();
}

function personEmail(d: any) {
  return String(d?.email ?? d?.user_email ?? "")
    .trim()
    .toLowerCase();
}

function campaignFundraiserId(c: any) {
  return Number(
    c?.fundraiser?.id ??
      c?.fundraiser_id ??
      c?.author?.id ??
      c?.author_id ??
      c?.user_id ??
      c?.created_by ??
      c?.owner_id ??
      0
  );
}

function completed(d: any) {
  const rawStatus = String(d?.status ?? "").trim().toLowerCase();
  if (rawStatus === "trash" || rawStatus === "trashed") return false;

  const s = String(
    d?.payment_status ?? d?.status ?? d?.donation_status ?? ""
  )
    .trim()
    .toLowerCase();

  return [
    "completed",
    "complete",
    "paid",
    "approved",
    "success",
    "successful",
  ].includes(s);
}

function donationAmount(d: any) {
  return Number(d?.amount ?? d?.donation_amount ?? d?.total ?? 0);
}

function donationDate(d: any) {
  const raw = d?.created_at ?? d?.date_created ?? d?.date;
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

async function fetchAllPages(baseEndpoint: string, perPage = 200) {
  const allRows: any[] = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const sep = baseEndpoint.includes("?") ? "&" : "?";
    const res: any = await adminApi(
      `${baseEndpoint}${sep}page=${currentPage}&per_page=${perPage}`
    );
    const pageRows = rowsFrom(res);
    allRows.push(...pageRows);

    const meta = res?.pagination ?? res?.paginated ?? res;
    const total = Number(meta?.total ?? res?.total ?? res?.overall ?? 0);
    const totalPages = Number(meta?.total_pages ?? meta?.last_page ?? 0);

    if (pageRows.length === 0) {
      hasMore = false;
    } else if (typeof res?.has_more === "boolean") {
      hasMore = res.has_more;
    } else if (totalPages > 0) {
      hasMore = currentPage < totalPages;
    } else if (total > 0) {
      hasMore = allRows.length < total;
    } else {
      hasMore = pageRows.length === perPage;
    }

    currentPage += 1;
  }

  return allRows;
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function PersonDetail({
  kind,
}: {
  kind: "donor" | "fundraiser";
}) {
  const { id } = useParams<{ id: string }>();
  const targetId = Number(id);

  const [p, setP] = useState<any>({});
  const [metaStats, setMetaStats] = useState<Record<string, string> | null>(
    null
  );
  const [don, setDon] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
  });

  const [viewerRole, setViewerRole] = useState("");

  useEffect(() => {
    setViewerRole(dashboardRole(savedDashboardUser()));
  }, []);

  const isAdminViewer = viewerRole === "admin";

  const [tab, setTab] = useState<"overview" | "campaigns" | "donations">(
    "overview"
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      setCampaigns([]);
      setDon([]);
      setActivities([]);
      setShowAllActivities(false);
      setMetaStats(null);

      try {
        const role = dashboardRole(savedDashboardUser());

        if (kind === "donor" && role === "fundraiser") {
          const token = localStorage.getItem("access_token") || "";
          const headers = { Authorization: `Bearer ${token}` };
          const [dr, rr] = await Promise.all([
            fetch("/api/dashboard/fundraiser-donors", {
              headers,
              cache: "no-store",
            }),
            fetch("/api/dashboard/fundraiser-donations", {
              headers,
              cache: "no-store",
            }),
          ]);
          const dj: any = await dr.json();
          const rj: any = await rr.json();
          if (!dr.ok) throw new Error(dj?.message || "Unable to load donor.");

          const donors = Array.isArray(dj?.data) ? dj.data : [];
          const person = donors.find(
            (x: any) =>
              Number(x?.id ?? x?.user_id ?? x?.donor_id) === targetId
          );
          if (!person) {
            throw new Error(
              "This donor was not found among donors to your campaigns."
            );
          }
          setP(person);

          const all = Array.isArray(rj?.data) ? rj.data : [];
          const selectedId = Number(
            person?.id ?? person?.user_id ?? person?.donor_id ?? targetId
          );
          const selectedEmail = personEmail(person);
          const matchedDonations = all.filter(
            (x: any) =>
              completed(x) &&
              ((selectedId > 0 && donorId(x) === selectedId) ||
                (!donorId(x) &&
                  selectedEmail &&
                  donorEmail(x) === selectedEmail))
          );
          setDon(matchedDonations);

          // Synthesize donor activity items for fundraiser-scoped donor view
          setActivities(
            matchedDonations.map((d: any) => ({
              id: d.id ?? d.donation_id,
              type: ACTIVITY_TYPES.DONATION_CREATION,
              campaign_id: d.campaign?.id ?? d.campaign_id,
              campaign_title: d.campaign?.title ?? d.campaign_title,
              donation_id: d.id ?? d.donation_id,
              data: { donation_amount: Math.round(donationAmount(d) * 100) },
              user_id: selectedId,
              created_at: d.created_at ?? d.date_created ?? d.date,
            }))
          );
        } else {
          const overviewData = dataFrom(
            await adminApi(`${kind}/${targetId}/overview`)
          );
          setP(overviewData?.[kind] || overviewData);
          if (
            overviewData?.meta &&
            typeof overviewData.meta === "object" &&
            Object.keys(overviewData.meta).length > 0
          ) {
            setMetaStats(overviewData.meta);
          }
          setLoading(false);

          try {
            if (kind === "donor") {
              const [donorRows, donorActivityRows] = await Promise.all([
                fetchAllPages(
                  `donations/paginated?user_id=${targetId}&status=completed&orderby=id&order=desc`,
                  200
                ),
                adminApi(
                  `activities/paginated?page=1&per_page=50&user_id=${targetId}`
                )
                  .then(rowsFrom)
                  .catch(() => []),
              ]);

              setDon(donorRows.filter(completed));
              setActivities(donorActivityRows);
            } else {
              // 1. Fetch all owned campaigns for this fundraiser
              const campaignRows = await fetchAllPages(
                `campaigns?status=all&fundraiser_id=${targetId}`,
                200
              );

              const owned = campaignRows.filter((c: any) => {
                const st = String(c?.status ?? "").trim().toLowerCase();
                if (st === "trash" || st === "trashed") return false;
                return campaignFundraiserId(c) === targetId;
              });

              setCampaigns(owned);

              const campaignIds = owned
                .map((c: any) => Number(c?.id ?? 0))
                .filter((cid: number) => cid > 0);

              if (campaignIds.length === 0) {
                setDon([]);
                setActivities([]);
              } else {
                const idsParam = campaignIds.join(",");

                // 2. Fetch completed donations AND D1 activities for owned campaign IDs in parallel
                const [rawDonationsInit, fundraiserActivities] =
                  await Promise.all([
                    fetchAllPages(
                      `donations/paginated?status=completed&campaign_ids=${idsParam}&orderby=id&order=desc`,
                      500
                    ),
                    adminApi(
                      `activities/paginated?page=1&per_page=50&campaign_ids=${idsParam}`
                    )
                      .then(rowsFrom)
                      .catch(() => []),
                  ]);

                setActivities(fundraiserActivities);

                let rawDonations = rawDonationsInit;
                const campaignIdSet = new Set<number>(campaignIds);
                const hasUnrelatedRows = rawDonations.some((d: any) => {
                  const cid = Number(d?.campaign?.id ?? d?.campaign_id ?? 0);
                  return cid > 0 && !campaignIdSet.has(cid);
                });

                if (hasUnrelatedRows) {
                  const batches = await Promise.all(
                    campaignIds.map((cid: number) =>
                      fetchAllPages(
                        `donations/paginated?status=completed&campaign_id=${cid}&orderby=id&order=desc`,
                        100
                      ).catch(() => [])
                    )
                  );
                  rawDonations = batches.flat();
                }

                const seen = new Set<number>();
                const onlyCompleted = rawDonations.filter((d: any) => {
                  const donationId = Number(d?.id ?? d?.donation_id ?? 0);
                  if (donationId && seen.has(donationId)) return false;
                  if (donationId) seen.add(donationId);

                  const dCampaignId = Number(
                    d?.campaign?.id ?? d?.campaign_id ?? 0
                  );
                  return campaignIdSet.has(dCampaignId) && completed(d);
                });

                setDon(onlyCompleted);
              }
            }
          } catch {
            setDon([]);
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [targetId, kind]);

  const campaignTitleMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of campaigns) {
      const cid = Number(c?.id ?? 0);
      if (cid > 0 && c?.title) {
        map.set(cid, String(c.title));
      }
    }
    for (const d of don) {
      const cid = Number(d?.campaign?.id ?? d?.campaign_id ?? 0);
      const title = d?.campaign?.title ?? d?.campaign_title;
      if (cid > 0 && title && !map.has(cid)) {
        map.set(cid, String(title));
      }
    }
    return map;
  }, [campaigns, don]);

  const completedDonations = useMemo(() => don.filter(completed), [don]);

  const sorted = useMemo(
    () =>
      [...completedDonations].sort(
        (a, b) =>
          (donationDate(b)?.getTime() || 0) -
          (donationDate(a)?.getTime() || 0)
      ),
    [completedDonations]
  );

  const timelineItems = useMemo(() => {
    return [...activities].sort((a, b) => {
      const timeB = parseActivityDate(b?.created_at)?.getTime() ?? 0;
      const timeA = parseActivityDate(a?.created_at)?.getTime() ?? 0;
      return timeB - timeA || Number(b?.id ?? 0) - Number(a?.id ?? 0);
    });
  }, [activities]);

  const visibleActivities = showAllActivities
    ? timelineItems
    : timelineItems.slice(0, 8);

  const pages = Math.max(1, Math.ceil(sorted.length / 10));
  const pageRows = sorted.slice((page - 1) * 10, page * 10);

  if (loading) return <CardBox>Loading…</CardBox>;
  if (error) {
    return (
      <CardBox>
        <div className="rounded-md bg-lighterror px-4 py-3 text-error">
          {error}
        </div>
      </CardBox>
    );
  }

  const u = p?.user ?? p?.donor ?? p?.fundraiser ?? p?.profile ?? p;
  const name =
    [u.first_name, u.last_name].filter(Boolean).join(" ") ||
    u.display_name ||
    u.name ||
    `${kind} #${id}`;

  const scopedTotal = completedDonations.reduce(
    (s, d) => s + donationAmount(d),
    0
  );
  const computedTotal =
    kind === "fundraiser"
      ? scopedTotal
      : completedDonations.length
        ? scopedTotal
        : Number(p.total_given ?? p.total_contributions ?? 0);
  const computedCount = completedDonations.length;
  const computedAvg = computedCount > 0 ? computedTotal / computedCount : 0;
  const computedCamps =
    kind === "fundraiser"
      ? campaigns.length
      : new Set(
          completedDonations
            .map((d) => d?.campaign?.id ?? d?.campaign_id)
            .filter(Boolean)
        ).size;

  const total =
    kind === "fundraiser"
      ? metaStats?.total_raised !== undefined && completedDonations.length === 0
        ? Number(metaStats.total_raised)
        : computedTotal
      : metaStats?.total_donated !== undefined && completedDonations.length === 0
        ? Number(metaStats.total_donated)
        : computedTotal;

  const count =
    kind === "fundraiser"
      ? metaStats?.donations_received !== undefined &&
        completedDonations.length === 0
        ? Number(metaStats.donations_received)
        : computedCount
      : metaStats?.total_donations !== undefined &&
          completedDonations.length === 0
        ? Number(metaStats.total_donations)
        : computedCount;

  const avg =
    metaStats?.average_donation !== undefined && completedDonations.length === 0
      ? Number(metaStats.average_donation)
      : count > 0
        ? total / count
        : computedAvg;

  const camps =
    kind === "fundraiser"
      ? metaStats?.total_campaigns !== undefined && campaigns.length === 0
        ? Number(metaStats.total_campaigns)
        : computedCamps
      : metaStats?.donated_campaigns !== undefined &&
          completedDonations.length === 0
        ? Number(metaStats.donated_campaigns)
        : computedCamps;

  function openEditProfile() {
    const u = p?.user ?? p?.donor ?? p?.profile ?? p;

    setProfile({
      first_name: String(u.first_name ?? ""),
      last_name: String(u.last_name ?? ""),
      email: String(u.email ?? u.user_email ?? ""),
      username: String(u.username ?? u.user_login ?? ""),
      phone: String(u.phone ?? ""),
    });

    setEditOpen(true);
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setActionBusy(true);
    setError("");

    try {
      await adminApi(`donor/${id}/update`, {
        method: "POST",
        body: JSON.stringify(profile),
      });

      setP((previous: any) => ({
        ...previous,
        ...profile,
        donor: previous?.donor
          ? { ...previous.donor, ...profile }
          : previous?.donor,
      }));

      setActionNotice("Donor profile updated successfully.");
      setEditOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setActionBusy(false);
    }
  }

  async function makeFundraiser() {
    if (!confirm("Make this donor a fundraiser?")) return;

    setActionBusy(true);
    setError("");

    try {
      await adminApi("fundraiser/make-fundraiser", {
        method: "POST",
        body: JSON.stringify({ user_id: targetId }),
      });

      setActionNotice("Donor successfully made a fundraiser.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Conversion failed.");
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{name}</h2>

        {kind === "donor" && isAdminViewer && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={actionBusy}
              onClick={openEditProfile}
            >
              Edit Profile
            </Button>

            <Button disabled={actionBusy} onClick={makeFundraiser}>
              Make Fundraiser
            </Button>
          </div>
        )}
      </div>

      {actionNotice && (
        <p className="text-sm text-green-600">{actionNotice}</p>
      )}

      <div className="flex gap-2 border-b border-ld">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            tab === "overview"
              ? "border-b-2 border-primary text-primary"
              : "text-darklink"
          }`}
          onClick={() => {
            setTab("overview");
            setPage(1);
          }}
        >
          Overview
        </button>

        {kind === "fundraiser" && (
          <button
            className={`px-4 py-3 text-sm font-medium ${
              tab === "campaigns"
                ? "border-b-2 border-primary text-primary"
                : "text-darklink"
            }`}
            onClick={() => {
              setTab("campaigns");
              setPage(1);
            }}
          >
            Campaigns
          </button>
        )}

        <button
          className={`px-4 py-3 text-sm font-medium ${
            tab === "donations"
              ? "border-b-2 border-primary text-primary"
              : "text-darklink"
          }`}
          onClick={() => {
            setTab("donations");
            setPage(1);
          }}
        >
          Donations
        </button>
      </div>

      {editOpen && kind === "donor" && isAdminViewer && (
        <div className="rounded-xl border border-ld p-5">
          <h3 className="mb-4 font-semibold">Edit Donor Profile</h3>

          <form onSubmit={saveProfile} className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["first_name", "First Name"],
                ["last_name", "Last Name"],
                ["email", "Email"],
                ["username", "Username"],
                ["phone", "Phone"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="text-sm">
                {label}
                <input
                  required={
                    key === "first_name" ||
                    key === "email" ||
                    key === "username"
                  }
                  type={key === "email" ? "email" : "text"}
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile((current) => ({
                      ...current,
                      [key]: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-ld bg-transparent px-3 py-2"
                />
              </label>
            ))}

            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={actionBusy}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
            {[
              [
                kind === "fundraiser" ? "Total Raised" : "Total Donated",
                `$${total.toFixed(2)}`,
              ],
              ["Average Donation", `$${avg.toFixed(2)}`],
              [
                kind === "fundraiser" ? "Total Campaigns" : "Donated Campaigns",
                camps,
              ],
              [
                kind === "fundraiser"
                  ? "Donations Received"
                  : "Total Donations",
                count,
              ],
            ].map(([a, b]) => (
              <CardBox key={String(a)}>
                <p className="text-darklink">{a}</p>
                <h3 className="mt-3 text-2xl font-semibold">{b}</h3>
              </CardBox>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[430px_1fr]">
            <CardBox>
              <div className="flex items-center gap-4">
                {u.avatar_url || u.profile_image || u.image || u.avatar ? (
                  <img
                    src={
                      u.avatar_url ??
                      u.profile_image ??
                      u.image?.url ??
                      u.avatar
                    }
                    alt={name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lightprimary text-xl font-semibold text-primary">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{name}</h3>

                  <p className="mt-1 text-sm text-darklink">
                    {kind === "fundraiser" ? "Fundraiser" : "Donor"} · ID #{id}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-darklink">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium">
                    {u.email ?? u.user_email ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-darklink">
                    Verification Status
                  </p>

                  <div className="mt-2">
                    {[true, 1, "1", "true", "verified", "yes"].includes(
                      typeof (
                        u.is_verified ??
                        u.verified ??
                        u.email_verified ??
                        u.is_email_verified ??
                        u.verification_status
                      ) === "string"
                        ? (
                            u.is_verified ??
                            u.verified ??
                            u.email_verified ??
                            u.is_email_verified ??
                            u.verification_status
                          ).toLowerCase()
                        : (
                            u.is_verified ??
                            u.verified ??
                            u.email_verified ??
                            u.is_email_verified ??
                            u.verification_status
                          )
                    ) ? (
                      <span className="inline-flex rounded-full bg-lightsuccess px-3 py-1 text-xs font-medium text-success">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-lightwarning px-3 py-1 text-xs font-medium text-warning">
                        Not verified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-darklink">
                    Joined Date
                  </p>

                  <p className="mt-1 font-medium">
                    {u.joined_at ||
                    u.user_registered ||
                    u.date_created ||
                    u.created_at
                      ? new Date(
                          u.joined_at ??
                            u.user_registered ??
                            u.date_created ??
                            u.created_at
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </CardBox>

            {/* Modern Activity Timeline Card */}
            <CardBox>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon
                      icon="solar:history-bold-duotone"
                      className="text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {kind === "donor" ? "Donor Activities" : "Activity Logs"}
                    </h3>
                    <p className="text-xs text-darklink">
                      {kind === "donor"
                        ? "Recent contribution history across campaigns"
                        : "Real-time milestones and events across owned campaigns"}
                    </p>
                  </div>
                </div>

                {timelineItems.length > 0 && (
                  <span className="rounded-full border border-ld px-2.5 py-0.5 text-xs font-medium text-darklink">
                    {timelineItems.length}{" "}
                    {timelineItems.length === 1 ? "event" : "events"}
                  </span>
                )}
              </div>

              {visibleActivities.length > 0 ? (
                <div className="mt-6">
                  <ol className="relative space-y-1">
                    {visibleActivities.map((item, idx) => {
                      const visual = buildActivityVisual(
                        item,
                        kind,
                        campaignTitleMap
                      );
                      const styles = TONE_STYLES[visual.tone];
                      const dt = parseActivityDate(item?.created_at);
                      const isLast = idx === visibleActivities.length - 1;

                      return (
                        <li
                          key={item?.id ?? `${item?.type}-${idx}`}
                          className="group relative flex gap-4 pb-5 last:pb-0"
                        >
                          {/* Connecting vertical rail */}
                          {!isLast && (
                            <span
                              aria-hidden="true"
                              className="absolute left-[19px] top-10 -bottom-1 w-[2px] bg-gradient-to-b from-border via-border/70 to-transparent dark:from-white/15 dark:via-white/10"
                            />
                          )}

                          {/* Solar Icon Node */}
                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105 ${styles.ring}`}
                          >
                            <Icon icon={visual.icon} className="text-xl" />
                          </div>

                          {/* Event Content Card */}
                          <div className="min-w-0 flex-1 rounded-xl border border-transparent px-3 py-1.5 transition-colors duration-150 group-hover:border-ld group-hover:bg-lightgray/40 dark:group-hover:bg-white/[0.02]">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <p className="text-sm leading-relaxed text-darklink">
                                {visual.message}
                              </p>

                              <span
                                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles.badge}`}
                              >
                                {visual.badgeLabel}
                              </span>
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-darklink/80">
                              <span className="inline-flex items-center gap-1">
                                <Icon
                                  icon="solar:clock-circle-linear"
                                  className="text-sm"
                                />
                                {formatRelativeTime(dt)}
                              </span>

                              {dt && (
                                <>
                                  <span>·</span>
                                  <span>
                                    {dt.toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </>
                              )}

                              {item?.donation_id ? (
                                <>
                                  <span>·</span>
                                  <span className="font-mono text-[11px]">
                                    Donation #{item.donation_id}
                                  </span>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {timelineItems.length > 8 && (
                    <div className="mt-5 flex justify-center border-t border-ld pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAllActivities((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        {showAllActivities
                          ? "Show fewer activities"
                          : `View all ${timelineItems.length} activities`}
                        <Icon
                          icon={
                            showAllActivities
                              ? "solar:alt-arrow-up-linear"
                              : "solar:alt-arrow-down-linear"
                          }
                          className="text-sm"
                        />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-ld py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightgray text-darklink dark:bg-white/5">
                    <Icon
                      icon="solar:Ghost-smile-bold-duotone"
                      className="text-2xl"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium">
                    No activity logs yet
                  </p>
                  <p className="mt-1 text-xs text-darklink">
                    {kind === "donor"
                      ? "Donations made by this donor will appear here."
                      : "Campaign reviews, updates, deadlines, and donations will appear here."}
                  </p>
                </div>
              )}
            </CardBox>
          </div>
        </>
      )}

      {tab === "campaigns" && kind === "fundraiser" && (
        <CardBox>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Campaigns</h3>

              <p className="mt-1 text-sm text-darklink">
                {campaigns.length} total campaign
                {campaigns.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdminViewer && <TableHead>ID</TableHead>}
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Raised</TableHead>
                  {isAdminViewer && <TableHead>Donations</TableHead>}
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {campaigns.length ? (
                  campaigns.map((campaign: any) => {
                    const campaignId = campaign?.id ?? "—";
                    const title =
                      campaign?.title ??
                      campaign?.name ??
                      `Campaign #${campaignId}`;
                    const status = campaign?.status ?? "—";
                    const goal = Number(
                      campaign?.goal_amount ?? campaign?.goal ?? 0
                    );
                    const raised = Number(
                      campaign?.fund_raised ?? campaign?.raised_amount ?? 0
                    );
                    const rawDate =
                      campaign?.created_at ??
                      campaign?.start_date ??
                      campaign?.date_created;
                    const createdDate = rawDate ? new Date(rawDate) : null;

                    return (
                      <TableRow key={campaignId}>
                        {isAdminViewer && <TableCell>#{campaignId}</TableCell>}

                        <TableCell>
                          <div>
                            <p className="font-medium">{title}</p>
                            <p className="mt-1 text-xs text-darklink">
                              #{campaignId}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="capitalize">
                          {String(status).replace(/-/g, " ").replace(/_/g, " ")}
                        </TableCell>

                        <TableCell>${goal.toFixed(2)}</TableCell>

                        <TableCell>${raised.toFixed(2)}</TableCell>

                        {isAdminViewer && (
                          <TableCell>
                            {Number(
                              campaign?.donations_count ??
                                campaign?.donation_count ??
                                campaign?.total_donations ??
                                campaign?.donations ??
                                0
                            )}
                          </TableCell>
                        )}

                        <TableCell>
                          {createdDate && !Number.isNaN(createdDate.getTime())
                            ? createdDate.toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isAdminViewer ? 7 : 5}
                      className="py-10 text-center text-darklink"
                    >
                      No campaigns found for this fundraiser.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBox>
      )}

      {tab === "donations" && (
        <CardBox>
          <h3 className="text-lg font-semibold">Donations</h3>

          <div className="mt-5 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donation</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Amount</TableHead>

                  {isAdminViewer && (
                    <>
                      <TableHead>Status</TableHead>
                      <TableHead>Gateway Fee</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </>
                  )}

                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.length ? (
                  pageRows.map((d, i) => (
                    <TableRow key={d.id || d.donation_id || i}>
                      <TableCell>#{d.id || d.donation_id || "—"}</TableCell>

                      <TableCell>
                        {d.campaign?.title ||
                          d.campaign_title ||
                          `#${d.campaign?.id || d.campaign_id || "—"}`}
                      </TableCell>

                      <TableCell>${donationAmount(d).toFixed(2)}</TableCell>

                      {isAdminViewer && (
                        <>
                          <TableCell className="capitalize">
                            {String(
                              d.payment_status ??
                                d.status ??
                                d.donation_status ??
                                "—"
                            )}
                          </TableCell>

                          <TableCell>
                            $
                            {(Number(d.gateway_fee ?? 0) / 100).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                              }
                            )}
                          </TableCell>

                          <TableCell>
                            $
                            {(Number(d.platform_fee ?? 0) / 100).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                              }
                            )}
                          </TableCell>

                          <TableCell>
                            $
                            {(Number(d.tip_amount ?? 0) / 100).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                              }
                            )}
                          </TableCell>

                          <TableCell>
                            {typeof d.payment_method === "object" &&
                            d.payment_method !== null
                              ? d.payment_method.label ??
                                d.payment_method.name ??
                                d.payment_method.type ??
                                "—"
                              : d.payment_method ??
                                (typeof d.gateway === "object" &&
                                d.gateway !== null
                                  ? d.gateway.label ??
                                    d.gateway.name ??
                                    d.gateway.type ??
                                    "—"
                                  : d.gateway ?? d.gateway_id ?? "—")}
                          </TableCell>
                        </>
                      )}

                      <TableCell>
                        {donationDate(d)?.toLocaleDateString() || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isAdminViewer ? 9 : 4}
                      className="py-10 text-center text-darklink"
                    >
                      No donations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-darklink">
              Page {page} of {pages} · 10 items per page
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((x) => x - 1)}
              >
                Previous
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={page >= pages}
                onClick={() => setPage((x) => x + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardBox>
      )}
    </div>
  );
}