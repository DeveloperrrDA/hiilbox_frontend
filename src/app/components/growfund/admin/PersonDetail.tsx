"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { adminApi, dataFrom, rowsFrom } from "./adminApi";
import {
  dashboardRole,
  savedDashboardUser,
} from "@/lib/dashboard/roles";

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

function completed(d: any) {
  const s = String(
    d?.payment_status ??
      d?.status ??
      d?.donation_status ??
      ""
  ).toLowerCase();

  return (
    !s ||
    [
      "completed",
      "complete",
      "paid",
      "approved",
      "success",
      "successful",
    ].includes(s)
  );
}

function donationAmount(d: any) {
  return Number(
    d?.amount ??
      d?.donation_amount ??
      d?.total ??
      0
  );
}

function campaignOwnerId(c: any) {
  return Number(
    c?.author?.id ??
      c?.author_id ??
      c?.user_id ??
      c?.created_by ??
      c?.owner_id ??
      0
  );
}

function campaignRaised(c: any) {
  return Number(
    c?.fund_raised ??
      c?.raised_amount ??
      c?.amount_raised ??
      c?.total_raised ??
      0
  );
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U"
  );
}

function formatDate(value: any) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
}

function money(value: any) {
  const number = Number(value ?? 0);

  return `$${Number.isFinite(number)
    ? number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00"}`;
}

function activityText(activity: any) {
  return String(
    activity?.description ??
      activity?.message ??
      activity?.activity ??
      activity?.action ??
      activity?.title ??
      "Account activity"
  );
}

export default function PersonDetail({
  kind,
}: {
  kind: "donor" | "fundraiser";
}) {
  const { id } = useParams<{ id: string }>();

  const [p, setP] = useState<any>({});
  const [don, setDon] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "campaigns"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");

      try {
        const role = dashboardRole(savedDashboardUser());

        /*
         * Existing fundraiser-dashboard donor detail behavior.
         * Keep this unchanged so fundraiser donor viewing
         * continues to work.
         */
        if (kind === "donor" && role === "fundraiser") {
          const token =
            localStorage.getItem("access_token") || "";

          const headers = {
            Authorization: `Bearer ${token}`,
          };

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

          const dj = await dr.json();
          const rj = await rr.json();

          if (!dr.ok) {
            throw new Error(
              dj?.message || "Unable to load donor."
            );
          }

          const donors = Array.isArray(dj?.data)
            ? dj.data
            : [];

          const person = donors.find(
            (x: any) =>
              Number(
                x?.id ??
                  x?.user_id ??
                  x?.donor_id
              ) === Number(id)
          );

          if (!person) {
            throw new Error(
              "This donor was not found among donors to your campaigns."
            );
          }

          setP(person);

          const all = Array.isArray(rj?.data)
            ? rj.data
            : [];

          const selectedId = Number(
            person?.id ??
              person?.user_id ??
              person?.donor_id ??
              id
          );

          const selectedEmail = personEmail(person);

          setDon(
            all.filter(
              (x: any) =>
                completed(x) &&
                ((selectedId > 0 &&
                  donorId(x) === selectedId) ||
                  (!donorId(x) &&
                    selectedEmail &&
                    donorEmail(x) === selectedEmail))
            )
          );

          return;
        }

        /*
         * ADMIN FUNDRAISER DETAIL
         */
        if (kind === "fundraiser") {
          const overviewResponse = await adminApi(
            `fundraiser/${id}/overview`
          );

          const overview = dataFrom(overviewResponse);
          const person =
            overview?.fundraiser ??
            overview?.user ??
            overview;

          setP(person);

          /*
           * Load all campaigns once and associate them with
           * the fundraiser using campaign.author.id.
           *
           * We verified this is the account ID used by the
           * admin fundraiser list.
           */
         let ownedCampaigns: any[] = [];

try {
  const campaignResponse = await adminApi(
    "campaigns?page=1&per_page=100&status=all"
  );

  const allCampaigns = rowsFrom(
    campaignResponse
  );

  ownedCampaigns = allCampaigns.filter(
    (campaign: any) =>
      campaignOwnerId(campaign) ===
      Number(id)
  );

  setCampaigns(ownedCampaigns);
} catch {
  ownedCampaigns = [];
  setCampaigns([]);
}

/*
 * Activity for THIS fundraiser.
 */
try {
  const activityResponse = await adminApi(
    `fundraiser/${id}/activities?page=1&per_page=10`
  );

  setActivities(
    rowsFrom(activityResponse)
  );
} catch {
  setActivities([]);
}

/*
 * Load donations and keep only donations
 * belonging to THIS fundraiser's campaigns.
 */
try {
  const donationResponse = await adminApi(
    "donations/paginated?page=1&per_page=100&orderby=id&order=desc"
  );

  const allDonations = rowsFrom(
    donationResponse
  );

  const ownedCampaignIds = new Set(
    ownedCampaigns.map((campaign: any) =>
      String(campaign?.id)
    )
  );

  const fundraiserDonations =
    allDonations.filter((donation: any) => {
      const campaignId = String(
        donation?.campaign?.id ??
        donation?.campaign_id ??
        donation?.campaign ??
        ""
      );

      return ownedCampaignIds.has(
        campaignId
      );
    });

  setDon(fundraiserDonations);
} catch {
  setDon([]);
}

          return;
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Unable to load details."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id, kind]);

  const name =
    [p?.first_name, p?.last_name]
      .filter(Boolean)
      .join(" ") ||
    p?.display_name ||
    p?.name ||
    `${kind} #${id}`;

  /*
   * DONOR STATISTICS
   */
  const completedDonations = useMemo(
    () => don.filter(completed),
    [don]
  );

  const donorTotal = completedDonations.length
    ? completedDonations.reduce(
        (sum, donation) =>
          sum + donationAmount(donation),
        0
      )
    : Number(
        p?.total_given ??
          p?.total_contributions ??
          0
      );

  const donorCount =
    completedDonations.length ||
    Number(
      p?.donations_count ??
        p?.number_of_contributions ??
        0
    );

  const donorAverage = donorCount
    ? donorTotal / donorCount
    : 0;

  const donorCampaigns = new Set(
    completedDonations
      .map(
        (d) =>
          d?.campaign?.id ??
          d?.campaign_id
      )
      .filter(Boolean)
  ).size;

  /*
   * FUNDRAISER STATISTICS
   */
  const totalCampaigns = campaigns.length;

  const completedReceivedDonations =
    don.filter(completed);

  const donationsReceived =
    completedReceivedDonations.length > 0
      ? completedReceivedDonations.reduce(
          (sum, donation) =>
            sum + donationAmount(donation),
          0
        )
      : campaigns.reduce(
          (sum, campaign) =>
            sum + campaignRaised(campaign),
          0
        );

  if (loading) {
    return (
      <CardBox>
        <div className="py-12 text-center">
          Loading…
        </div>
      </CardBox>
    );
  }

  if (error) {
    return (
      <CardBox>
        <div className="rounded-md bg-lighterror px-4 py-3 text-error">
          {error}
        </div>
      </CardBox>
    );
  }

  /*
   * =========================================================
   * ADMIN FUNDRAISER PROFILE
   * =========================================================
   */
  if (kind === "fundraiser") {
    const status = String(
      p?.verification_status ??
        p?.status ??
        p?.account_status ??
        "approved"
    ).toLowerCase();

    const verified = [
      "approved",
      "verified",
      "active",
      "published",
    ].includes(status);

    const joined =
      p?.joined_at ??
      p?.user_registered ??
      p?.date_created ??
      p?.created_at ??
      p?.registered_at;

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">
            {name}
          </h2>

          <Button asChild variant="outline">
            <Link
              href={`/dashboard/fundraisers?edit=${id}`}
            >
              <Icon
                icon="solar:pen-2-line-duotone"
                className="mr-2 text-lg"
              />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() =>
                setActiveTab("overview")
              }
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-darklink hover:text-dark"
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("campaigns")
              }
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === "campaigns"
                  ? "border-primary text-primary"
                  : "border-transparent text-darklink hover:text-dark"
              }`}
            >
              Campaigns
            </button>
          </div>
        </div>

        {activeTab === "overview" ? (
          <>
            {/* Fundraiser statistics */}
            <div className="grid gap-5 md:grid-cols-2">
              <CardBox>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightprimary text-primary">
                    <Icon
                      icon="solar:case-round-minimalistic-line-duotone"
                      className="text-2xl"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-darklink">
                      Total Campaigns
                    </p>

                    <h3 className="mt-1 text-2xl font-semibold">
                      {totalCampaigns}
                    </h3>
                  </div>
                </div>
              </CardBox>

              <CardBox>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightprimary text-primary">
                    <Icon
                      icon="solar:dollar-minimalistic-line-duotone"
                      className="text-2xl"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-darklink">
                      Total Donation Received
                    </p>

                    <h3 className="mt-1 text-2xl font-semibold">
                      {money(donationsReceived)}
                    </h3>
                  </div>
                </div>
              </CardBox>
            </div>

            {/* Profile + activities */}
            <div className="grid gap-5 lg:grid-cols-[430px_1fr]">
              <CardBox>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lightprimary text-lg font-semibold text-primary">
                    {initials(name)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">
                      {name}
                    </h3>

                    <p className="truncate text-sm text-darklink">
                      {p?.email ??
                        p?.user_email ??
                        "—"}
                    </p>

                    <p className="mt-1 text-sm text-darklink">
                      ID #{id}
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-5 border-t border-border pt-6">
                  <div>
                    <p className="text-xs text-darklink">
                      Verification
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          verified
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      />

                      <span className="text-sm font-medium capitalize">
                        {verified
                          ? "Verified"
                          : status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-darklink">
                      Joined
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Icon
                        icon="solar:calendar-line-duotone"
                        className="text-xl text-darklink"
                      />

                      <span>
                        {formatDate(joined)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBox>

              <CardBox>
                <h3 className="text-lg font-semibold">
                  Activity Logs
                </h3>

                {activities.length ? (
                  <div className="mt-5 divide-y divide-border">
                    {activities
                      .slice(0, 6)
                      .map(
                        (
                          activity: any,
                          index: number
                        ) => (
                          <div
                            key={
                              activity?.id ??
                              index
                            }
                            className="flex gap-3 py-4 first:pt-0"
                          >
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary">
                              <Icon
                                icon="solar:history-line-duotone"
                                className="text-xl"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-medium">
                                {activityText(
                                  activity
                                )}
                              </p>

                              <p className="mt-1 text-xs text-darklink">
                                {formatDate(
                                  activity?.created_at ??
                                    activity?.date_created ??
                                    activity?.date
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center text-center">
                    <Icon
                      icon="solar:history-line-duotone"
                      className="mb-3 text-4xl text-darklink"
                    />

                    <p className="text-sm text-darklink">
                      No activities created yet.
                    </p>
                  </div>
                )}
              </CardBox>
            </div>
          </>
        ) : (
          /* Campaigns tab */
          <CardBox>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">
                Campaigns
              </h3>

              <span className="text-sm text-darklink">
                {campaigns.length} campaign
                {campaigns.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>

            <div className="mt-5 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Campaign
                    </TableHead>
                    <TableHead>
                      Status
                    </TableHead>
                    <TableHead>
                      Goal
                    </TableHead>
                    <TableHead>
                      Raised
                    </TableHead>
                    <TableHead>
                      Contributors
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {campaigns.length ? (
                    campaigns.map(
                      (
                        campaign: any,
                        index: number
                      ) => (
                        <TableRow
                          key={
                            campaign?.id ??
                            index
                          }
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {campaign?.title ??
                                  `Campaign #${campaign?.id}`}
                              </p>

                              <p className="mt-1 text-xs text-darklink">
                                #{campaign?.id}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="capitalize">
                              {campaign?.status ??
                                "—"}
                            </span>
                          </TableCell>

                          <TableCell>
                            {money(
                              campaign?.goal_amount ??
                                campaign?.goal ??
                                0
                            )}
                          </TableCell>

                          <TableCell>
                            {money(
                              campaignRaised(
                                campaign
                              )
                            )}
                          </TableCell>

                          <TableCell>
                            {Number(
                              campaign?.number_of_contributors ??
                                campaign?.contributors_count ??
                                0
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-12 text-center text-darklink"
                      >
                        No campaigns found for
                        this fundraiser.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardBox>
        )}
      </div>
    );
  }

  /*
   * =========================================================
   * DONOR DETAIL
   *
   * Existing donor layout/functionality retained.
   * =========================================================
   */
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">
        {name}
      </h2>

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {[
          [
            "Total Donated",
            money(donorTotal),
          ],
          [
            "Average Donation",
            money(donorAverage),
          ],
          [
            "Donated Campaigns",
            donorCampaigns,
          ],
          ["Total Donation", donorCount],
        ].map(([a, b]) => (
          <CardBox key={String(a)}>
            <p className="text-darklink">
              {a}
            </p>

            <h3 className="mt-3 text-2xl font-semibold">
              {b}
            </h3>
          </CardBox>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[430px_1fr]">
        <CardBox>
          <h3 className="text-lg font-semibold">
            {name}
          </h3>

          <p className="mt-1 text-darklink">
            {p?.username ??
              p?.user_login ??
              ""}{" "}
            · ID #{id}
          </p>

          <p className="mt-6">
            {p?.email ??
              p?.user_email ??
              "—"}
          </p>

          <p className="mt-4 text-darklink">
            Joined{" "}
            {formatDate(
              p?.joined_at ??
                p?.user_registered ??
                p?.date_created
            )}
          </p>
        </CardBox>

        <CardBox>
          <h3 className="text-lg font-semibold">
            Donations
          </h3>

          <div className="mt-5 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Donation
                  </TableHead>
                  <TableHead>
                    Campaign
                  </TableHead>
                  <TableHead>
                    Amount
                  </TableHead>
                  <TableHead>
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {don.length ? (
                  don.map(
                    (
                      d: any,
                      i: number
                    ) => (
                      <TableRow
                        key={
                          d?.id ??
                          d?.donation_id ??
                          i
                        }
                      >
                        <TableCell>
                          #
                          {d?.id ??
                            d?.donation_id}
                        </TableCell>

                        <TableCell>
                          {d?.campaign?.title ??
                            d?.campaign_title ??
                            `#${
                              d?.campaign?.id ??
                              d?.campaign_id ??
                              "—"
                            }`}
                        </TableCell>

                        <TableCell>
                          {money(
                            donationAmount(d)
                          )}
                        </TableCell>

                        <TableCell>
                          {formatDate(
                            d?.created_at ??
                              d?.date_created ??
                              d?.date
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-darklink"
                    >
                      No donations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBox>
      </div>
    </div>
  );
}