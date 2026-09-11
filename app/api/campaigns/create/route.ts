import { NextRequest, NextResponse } from "next/server";
import { apiBase, bearer, jsonFrom } from "../_authProxy";

export async function POST(req: NextRequest) {
  const auth = bearer(req);
  if (!auth) return NextResponse.json({ message: "Please sign in to create a campaign." }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid campaign data." }, { status: 400 });
  const response = await fetch(`${apiBase}/campaigns/create`, {
    method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store",
  });
  return jsonFrom(response);
}
