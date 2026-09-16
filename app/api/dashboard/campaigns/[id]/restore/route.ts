import { NextRequest } from "next/server";
import { proxyUserPost } from "../../_server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyUserPost(req, `/campaign/${encodeURIComponent(id)}/restore`, id);
}
