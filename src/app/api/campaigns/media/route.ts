import { NextRequest, NextResponse } from "next/server";
import { apiBase, bearer, jsonFrom } from "../_authProxy";
export async function POST(req: NextRequest) {
  const auth = bearer(req);
  if (!auth) return NextResponse.json({ message: "Please sign in to upload media." }, { status: 401 });
  const form = await req.formData();
  return jsonFrom(await fetch(`${apiBase}/media`, { method: "POST", headers: { Authorization: auth }, body: form, cache: "no-store" }));
}
