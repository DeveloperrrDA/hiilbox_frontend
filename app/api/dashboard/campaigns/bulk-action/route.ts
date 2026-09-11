import { NextRequest } from "next/server";
import { proxyUserPost } from "../_server";
export async function POST(req: NextRequest) { return proxyUserPost(req, "/campaigns/bulk-action"); }
