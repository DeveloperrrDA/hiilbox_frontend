import { NextRequest, NextResponse } from "next/server";

/**
 * GrowFund currently exposes /campaigns/empty-trash but its controller reads a single
 * `id` and does not demonstrate fundraiser ownership scoping. Do not proxy a global
 * destructive operation until the backend contract is made account-safe. Individual
 * permanent deletion can be implemented through the ownership-checked bulk endpoint.
 */
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "Empty trash is disabled in the fundraiser dashboard because the current GrowFund endpoint is not safely scoped to the authenticated fundraiser.",
    },
    { status: 501 },
  );
}
