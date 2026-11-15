
import "server-only";

import {
  getCampaigns as getWordPressCampaigns,
  getCampaign as getWordPressCampaign,
  normalizeCampaign,
  type GetCampaignsParams,
  type CampaignsResponse,
  type Campaign,
} from "@/lib/campaigns";

import {
  getD1Campaigns,
  getD1Campaign,
} from "./campaigns-d1";

export async function getPublicCampaigns(
  params: GetCampaignsParams = {}
): Promise<CampaignsResponse> {
  const result = await getD1Campaigns(params);

  if (result) {
    return {
      success: true,
      data: result.data.map(normalizeCampaign),
      pagination: result.pagination,
    };
  }

  return getWordPressCampaigns(params);
}

export async function getPublicCampaign(
  id: number
): Promise<{ success: boolean; data: Campaign }> {
  const result = await getD1Campaign(id);

  if (result) {
    return {
      success: true,
      data: normalizeCampaign(result.data),
    };
  }

  return getWordPressCampaign(id);
}

export {
  getD1Campaigns as readPublicCampaigns,
  getD1Campaign as readPublicCampaign,
};
