import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../campaigns/_server";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  const raw = auth.user?.data ?? auth.user ?? {};
  return NextResponse.json({
    success: true,
    data: {
      id: Number(raw?.user_id ?? raw?.id ?? auth.userId),
      username: String(raw?.username ?? raw?.user_login ?? ""),
      email: String(raw?.email ?? raw?.user_email ?? ""),
      first_name: String(raw?.first_name ?? ""),
      last_name: String(raw?.last_name ?? ""),
      display_name: String(raw?.display_name ?? raw?.name ?? ""),
      avatar_url: String(raw?.avatar_url ?? raw?.avatar ?? ""),
    },
  });
}
