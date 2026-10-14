import { NextRequest, NextResponse } from "next/server";
import { apiBase, bearer } from "../_authProxy";

export async function GET(req: NextRequest) {
  const auth = bearer(req);
  if (!auth) return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });

  const upstream = new URL(`${apiBase}/locations/dropdown`);
  const include = req.nextUrl.searchParams.get("include_rest_of_the_world");
  if (include !== null) upstream.searchParams.set("include_rest_of_the_world", include);

  const response = await fetch(upstream, {
    headers: { Accept: "application/json", Authorization: auth },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ success: false, message: "Invalid location response from GrowFund." }));
  return NextResponse.json(data, { status: response.status });
}
