
import { NextResponse } from "next/server";
import { getRecentDonations } from "@/lib/donations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cachedDonations: Awaited<ReturnType<typeof getRecentDonations>> = [];
let lastFetch = 0;
let pendingFetch: ReturnType<typeof getRecentDonations> | null = null;

const CACHE_MS = 5 * 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (now - lastFetch < CACHE_MS) {
    return NextResponse.json(
      { donations: cachedDonations },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=300" } }
    );
  }

  if (!pendingFetch) {
    pendingFetch = getRecentDonations();
  }

  try {
    const donations = await pendingFetch;
    cachedDonations = donations;
    lastFetch = Date.now();

    return NextResponse.json(
      { donations },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=300" } }
    );
  } catch {
    return NextResponse.json({ donations: [] });
  } finally {
    pendingFetch = null;
  }
}
