import { NextRequest } from "next/server";
import { apiBase, bearer, jsonFrom } from "../_authProxy";

export async function GET(req: NextRequest) {
  const auth = bearer(req);

  if (!auth) {
    return jsonFrom(
      new Response(
        JSON.stringify({
          message: "Please sign in.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
  }

  const upstream = new URL(`${apiBase}/collaborators/paginated`);

  upstream.searchParams.set(
    "page",
    req.nextUrl.searchParams.get("page") || "1"
  );

  upstream.searchParams.set(
    "per_page",
    req.nextUrl.searchParams.get("per_page") || "100"
  );

  const search = req.nextUrl.searchParams.get("search");

  if (search) {
    upstream.searchParams.set("search", search);
  }

  const response = await fetch(upstream, {
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
    cache: "no-store",
  });

  return jsonFrom(response);
}