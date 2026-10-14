import { NextRequest, NextResponse } from "next/server";
import {
  apiBase,
  growfundJson,
  requireUser,
} from "@/app/api/dashboard/campaigns/_server";

function getCampaignId(data: any): number {
  const candidates = [
    data?.data?.id,
    data?.data?.campaign_id,
    data?.campaign?.id,
    data?.campaign_id,
    data?.id,
  ];

  for (const value of candidates) {
    const id = Number(value);

    if (Number.isFinite(id) && id > 0) {
      return id;
    }
  }

  return 0;
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);

  if ("error" in auth) {
    return auth.error;
  }

  try {
    /*
     * Creating a campaign is now only responsible for creating
     * the initial draft and obtaining its campaign ID.
     *
     * The full campaign is edited afterwards in CampaignEditor.
     */
     const payload = await req.json();
    const { response: createResponse, data: createData } =
      await growfundJson(`${apiBase}/campaigns/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth.authorization,
        },
       body: JSON.stringify(payload),
      });

    if (!createResponse.ok) {
  return NextResponse.json(createData, {
    status: createResponse.status,
  });
}



const campaignId = getCampaignId(createData);

    if (!campaignId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Campaign was created but the API did not return a valid campaign ID.",
        },
        { status: 502 }
      );
    }

    /*
     * Assign the newly created campaign to the authenticated
     * user immediately.
     *
     * This is important because fundraiser campaign access is
     * checked using author_id / fundraiser_id.
     */
    return NextResponse.json({
  success: true,
  id: campaignId,
});
    /*
     * The frontend only needs the ID.
     * Do not return the complete campaign object.
     */
    return NextResponse.json({
      success: true,
      id: campaignId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create campaign.",
      },
      { status: 500 }
    );
  }
}