import { NextRequest, NextResponse } from "next/server";
import { apiBase, bearer, jsonFrom } from "../_authProxy";

export async function POST(req: NextRequest) {
  const auth = bearer(req);

  if (!auth) {
    return NextResponse.json(
      { message: "Please sign in to create a campaign." },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${apiBase}/campaigns/create-draft`,
    {
      method: "POST",
      headers: {
        Authorization: auth,
      },
      cache: "no-store",
    }
  );

  return jsonFrom(response);
}