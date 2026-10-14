import { NextRequest, NextResponse } from "next/server";
import { apiBase, getOwnedCampaign, growfundJson, requireUser } from "../_server";

const allowedActions = new Set(["trash", "restore", "delete", "featured", "non-featured"]);

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json().catch(() => ({}));
    const ids: number[] = Array.isArray(body?.ids)
      ? Array.from(
          new Set<number>(
            body.ids
              .map((id: unknown) => Number(id))
              .filter((id: number) => Number.isInteger(id) && id > 0),
          ),
        )
      : [];
    const action = String(body?.action ?? "");

    if (!ids.length) return NextResponse.json({ success: false, message: "Select at least one campaign." }, { status: 422 });
    if (!allowedActions.has(action)) return NextResponse.json({ success: false, message: "Unsupported bulk campaign action." }, { status: 422 });

    // GrowFund's bulk endpoint accepts arbitrary campaign IDs. Verify every ID at the
    // Next.js boundary so a fundraiser cannot operate on another fundraiser's campaign.
    const ownership = await Promise.all(ids.map((id) => getOwnedCampaign(req, id, auth.userId)));
    const inaccessible = ids.filter((_, index) => !ownership[index].response.ok || !ownership[index].campaign);
    if (inaccessible.length) {
      return NextResponse.json({ success: false, message: "One or more selected campaigns do not belong to your account.", ids: inaccessible }, { status: 403 });
    }

    const { response, data } = await growfundJson(`${apiBase}/campaigns/bulk-action`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: auth.authorization },
      body: JSON.stringify({ ids, action }),
    });
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Bulk campaign action failed." }, { status: 500 });
  }
}
