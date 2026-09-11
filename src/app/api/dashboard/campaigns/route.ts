import { NextRequest, NextResponse } from "next/server";
import { apiBase, combinedHeaders, getSystemToken, growfundJson, requireUser } from "./_server";

const statuses = ["published", "draft", "pending", "funded", "declined", "trashed", "completed", "cancelled"];

function belongsToUser(campaign: any, userId: number) {
  const ids = [
    campaign?.author?.id,
    campaign?.author_id,
    campaign?.fundraiser?.id,
    campaign?.fundraiser_id,
    campaign?.user_id,
    campaign?.created_by,
    campaign?.owner_id,
  ].map(Number).filter(Boolean);
  return ids.includes(userId);
}

function extractCampaigns(data: any): any[] {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.paginated?.results)) return data.paginated.results;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  try {
    const systemToken = await getSystemToken(req.nextUrl.origin);
    const requestedStatus = req.nextUrl.searchParams.get("status") || "";
    const search = req.nextUrl.searchParams.get("search") || "";
    const targetStatuses = statuses.includes(requestedStatus) ? [requestedStatus] : statuses;

    const results = await Promise.all(targetStatuses.map(async (status) => {
      const qs = new URLSearchParams({ per_page: "100", page: "1", status });
      if (search) qs.set("search", search);
      const { response, data } = await growfundJson(`${apiBase}/campaigns?${qs.toString()}`, {
        method: "GET",
        headers: combinedHeaders(systemToken),
      });
      if (!response.ok) return [];
      return extractCampaigns(data);
    }));

    const byId = new Map<number, any>();
    results.flat().filter((campaign) => belongsToUser(campaign, auth.userId)).forEach((campaign) => byId.set(Number(campaign.id), campaign));
    const campaigns = Array.from(byId.values()).sort((a, b) => Number(b.id) - Number(a.id));

    return NextResponse.json({ success: true, data: campaigns, total: campaigns.length, user_id: auth.userId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to load campaigns." }, { status: 500 });
  }
}
