import { NextRequest, NextResponse } from "next/server";
import { apiBase, bearer } from "../_authProxy";

export async function GET(req: NextRequest) {
  const auth = bearer(req);
  if (!auth) return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });

  // GrowFund's Category Controller exposes the actual campaign category list here.
  const response = await fetch(`${apiBase}/categories/list`, {
    headers: { Accept: "application/json", Authorization: auth },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ success: false, message: "Invalid category response from GrowFund." }));
  return NextResponse.json(data, { status: response.status });
}
