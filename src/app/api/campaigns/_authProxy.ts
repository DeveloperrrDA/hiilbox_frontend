import { NextRequest, NextResponse } from "next/server";

export const apiBase = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1").replace(/\/$/, "");

export function bearer(req: NextRequest) {
  const value = req.headers.get("authorization") || "";
  return /^Bearer\s+\S+/i.test(value) ? value : null;
}

export async function jsonFrom(response: Response) {
  const data = await response.json().catch(() => ({ message: "Invalid response from GrowFund." }));
  return NextResponse.json(data, { status: response.status });
}
