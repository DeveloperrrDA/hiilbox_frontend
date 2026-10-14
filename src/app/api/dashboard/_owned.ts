import { NextRequest } from "next/server";

import {
  apiBase,
  combinedHeaders,
  getSystemToken,
  growfundJson,
} from "./campaigns/_server";

function extractRows(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.paginated?.results)) return data.paginated.results;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

export function userRoles(userResponse: any) {
  const source = userResponse?.data ?? userResponse ?? {};
  const raw =
    source?.roles ??
    source?.role ??
    source?.user_roles ??
    [];

  return (Array.isArray(raw) ? raw : [raw]).map((r: any) =>
    String(r).toLowerCase()
  );
}

export function isAdminUser(userResponse: any) {
  return userRoles(userResponse).some((r: string) =>
    ["administrator", "admin", "shop_manager"].includes(r)
  );
}

export function belongsToUser(c: any, userId: number) {
  return [
    c?.author?.id,
    c?.author_id,
    c?.fundraiser?.id,
    c?.fundraiser_id,
    c?.user_id,
    c?.created_by,
    c?.owner_id,
  ]
    .map(Number)
    .filter(Boolean)
    .includes(userId);
}

// Fetch all campaign pages so fundraiser ownership is not capped at 100 campaigns.
export async function ownedCampaigns(
  req: NextRequest,
  userId: number
) {
  const systemToken = await getSystemToken(req.nextUrl.origin);
  const byId = new Map<number, any>();

  const perPage = 100;
  let page = 1;

  while (true) {
    const qs = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      status: "all",
    });

    const { response, data } = await growfundJson(
      `${apiBase}/campaigns?${qs.toString()}`,
      {
        method: "GET",
        headers: combinedHeaders(systemToken),
      }
    );

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.data?.message ||
          "Unable to load campaigns."
      );
    }

    const batch = extractRows(data);

    batch
      .filter((campaign: any) =>
        belongsToUser(campaign, userId)
      )
      .forEach((campaign: any) => {
        const id = Number(campaign?.id);

        if (id) {
          byId.set(id, campaign);
        }
      });

    if (batch.length < perPage) {
      break;
    }

    page += 1;

    // Prevent an unexpected backend pagination loop.
    if (page > 100) {
      break;
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) =>
      Number(b?.id || 0) - Number(a?.id || 0)
  );
}

export { extractRows };