import { NextRequest, NextResponse } from "next/server";

import {
  apiBase,
  growfundJson,
  requireUser,
} from "../campaigns/_server";

import {
  extractRows,
  ownedCampaigns,
} from "../_owned";

function campaignId(r: any) {
  return Number(
    r?.campaign?.id ??
      r?.campaign_id ??
      r?.fund_id ??
      0
  );
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);

  if ("error" in auth) {
    return auth.error;
  }

  try {
    const campaigns = await ownedCampaigns(
      req,
      auth.userId
    );

    const ownedIds = new Set(
      campaigns
        .map((c: any) => Number(c.id))
        .filter(Boolean)
    );

    if (!ownedIds.size) {
      return NextResponse.json({
        success: true,
        data: [],
        campaigns: [],
        total: 0,
      });
    }

    const allDonations: any[] = [];
    const perPage = 100;
    let page = 1;

    while (true) {
      const q = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        orderby: "id",
        order: "desc",
      });

      const { response, data } = await growfundJson(
        `${apiBase}/donations?${q.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: auth.authorization,
          },
        }
      );

      if (!response.ok) {
        return NextResponse.json(data, {
          status: response.status,
        });
      }

      const batch = extractRows(data);

      for (const donation of batch) {
        if (ownedIds.has(campaignId(donation))) {
          allDonations.push(donation);
        }
      }

      if (batch.length < perPage) {
        break;
      }

      page += 1;

      // Safety guard against a malformed API returning
      // the same full page forever.
      if (page > 100) {
        break;
      }
    }

    return NextResponse.json({
      success: true,
      data: allDonations,
      total: allDonations.length,
      campaigns: campaigns.map((c: any) => ({
        id: c.id,
        title: c.title,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load fundraiser donations.",
      },
      { status: 500 }
    );
  }
}