import { Env } from "./utils";

const COMPLETED_STATUSES = new Set([
  "completed",
  "complete",
  "paid",
  "approved",
  "success",
  "successful",
]);

function parseJson(val: any) {
  if (!val || typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

function extractDonorId(donation: any): number {
  const donor = parseJson(donation.donor);
  return Number(
    donor?.id ??
      donor?.ID ??
      donor?.user_id ??
      donation.donor_id ??
      donation.user_id ??
      0
  );
}

function extractCampaignId(donation: any): number {
  const campaign = parseJson(donation.campaign);
  return Number(campaign?.id ?? donation.campaign_id ?? 0);
}

export async function syncDonorMeta(env: Env) {
  const [donorsRes, donationsRes] = await Promise.all([
    env.growfund_db.prepare(`SELECT id FROM donors`).all(),
    env.growfund_db
      .prepare(`SELECT id, donor, campaign, campaign_id, amount, status, payment_status FROM donations`)
      .all(),
  ]);

  const donors = donorsRes.results || [];
  const donations = donationsRes.results || [];

  if (donors.length === 0) return;

  // Initialize accumulators for every donor ID in the donors table
  const statsByDonor = new Map<
    number,
    { totalDonated: number; totalDonations: number; campaignIds: Set<number> }
  >();

  for (const row of donors) {
    const id = Number(row.id || 0);
    if (id > 0) {
      statsByDonor.set(id, {
        totalDonated: 0,
        totalDonations: 0,
        campaignIds: new Set<number>(),
      });
    }
  }

  const seenDonations = new Set<number>();

  for (const d of donations) {
    const donationId = Number(d.id || 0);
    if (donationId > 0) {
      if (seenDonations.has(donationId)) continue;
      seenDonations.add(donationId);
    }

    const rawStatus = String(d.status ?? "").trim().toLowerCase();
    if (rawStatus === "trash" || rawStatus === "trashed") continue;

    const effectiveStatus = String(d.payment_status || d.status || "")
      .trim()
      .toLowerCase();
    if (!COMPLETED_STATUSES.has(effectiveStatus)) continue;

    const donorId = extractDonorId(d);
    if (!donorId || !statsByDonor.has(donorId)) continue;

    const entry = statsByDonor.get(donorId)!;
    const amount = Number(d.amount || 0);
    entry.totalDonated += Number.isFinite(amount) ? amount : 0;
    entry.totalDonations += 1;

    const campaignId = extractCampaignId(d);
    if (campaignId > 0) {
      entry.campaignIds.add(campaignId);
    }
  }

  const stmt = env.growfund_db.prepare(`
    INSERT INTO donor_meta (donor_id, key, value, last_synced_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(donor_id, key) DO UPDATE SET
      value = excluded.value,
      last_synced_at = CURRENT_TIMESTAMP
  `);

  const batch: any[] = [];

  for (const [donorId, stats] of statsByDonor.entries()) {
    const totalDonated = Math.round(stats.totalDonated * 100) / 100;
    const totalDonations = stats.totalDonations;
    const donatedCampaigns = stats.campaignIds.size;
    const averageDonation =
      totalDonations > 0
        ? Math.round((totalDonated / totalDonations) * 100) / 100
        : 0;

    batch.push(
      stmt.bind(donorId, "total_donated", totalDonated.toFixed(2)),
      stmt.bind(donorId, "average_donation", averageDonation.toFixed(2)),
      stmt.bind(donorId, "donated_campaigns", String(donatedCampaigns)),
      stmt.bind(donorId, "total_donations", String(totalDonations))
    );
  }

  for (let i = 0; i < batch.length; i += 100) {
    await env.growfund_db.batch(batch.slice(i, i + 100));
  }
}