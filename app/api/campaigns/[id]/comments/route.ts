import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params;
  const id = Number(resolved.id);

  if (!id) {
    return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "3"; // Default to 3
    const commentType = searchParams.get("comment_type") || "comment";
    const parentId = searchParams.get("parent_id") || "0";
    
    const WORDPRESS_API = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1").replace(/\/$/, "");
    const apiKey = process.env.GROWFUND_CLIENT_API_KEY;
    
    if (!apiKey) throw new Error("API Key missing");

    const tokenRes = await fetch(`${WORDPRESS_API}/auth/system-token`, {
      method: "POST",
      headers: { "Accept": "application/json", "X-API-Key": apiKey },
      cache: "no-store",
    });
    const tokenData = await tokenRes.json();
    const token = tokenData?.system_access_token;

    if (!token) throw new Error("System token failed");

    const wpParams = new URLSearchParams({
      page,
      per_page: perPage,
      post_id: String(id),
      comment_type: commentType,
      parent_id: parentId
    });

    const wpResponse = await fetch(`${WORDPRESS_API}/campaign/update/comments/paginated?${wpParams.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-API-Key": apiKey,
      },
      cache: "no-store",
    });

    const data = await wpResponse.json();
    
    if (!wpResponse.ok) {
      return NextResponse.json({ success: false, message: data.message || "Failed" }, { status: wpResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error fetching comments" }, { status: 500 });
  }
}