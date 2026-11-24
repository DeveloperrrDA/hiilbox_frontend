import { NextRequest, NextResponse } from "next/server";
import { apiBase, growfundJson, requireUser } from "@/app/api/dashboard/campaigns/_server";

const ALLOWED = [
  /^auth\/me$/,
  /^donations\/paginated$/,
  /^donation\/[A-Za-z0-9_-]+\/receipt$/,
  /^donation\/\d+\/update-status$/,
  /^fundraiser\/wallet\/info$/,
  /^fundraiser\/kyc$/,
  /^fundraiser\/withdrawal\/request\/create$/,
  /^fundraiser\/withdrawal\/requests\/paginated$/,
  /^fundraiser\/\d+\/update-payout-method$/,
  /^fundraiser\/\d+\/update$/,
  /^fundraiser\/\d+\/overview$/,
  /^fundraiser\/\d+\/activities$/,
  /^donor\/\d+\/overview$/,
  /^donor\/\d+\/activities$/,
  /^donor\/\d+\/donations$/,
];

async function proxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }, method: "GET" | "POST") {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  const { path } = await context.params;
  const backendPath = (path || []).join("/");
  if (!backendPath || !ALLOWED.some((p) => p.test(backendPath))) {
    return NextResponse.json({ success: false, message: "Unsupported dashboard endpoint." }, { status: 404 });
  }
  const target = new URL(`${apiBase}/${backendPath}`);
  req.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));
  const headers: Record<string,string> = { Accept: "application/json", Authorization: auth.authorization };
  let body: string | undefined;
  if (method === "POST") {
    body = await req.text();
    if (body) headers["Content-Type"] = req.headers.get("content-type") || "application/json";
  }
  try {
    const { response, data } = await growfundJson(target.toString(), { method, headers, body: body || undefined });
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Dashboard request failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) { return proxy(req, context, "GET"); }
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) { return proxy(req, context, "POST"); }
