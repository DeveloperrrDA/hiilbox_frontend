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

function extractCampaignFundraiserId(campaign: any): number {
  const fundraiser = parseJson(campaign.fundraiser);
  const author = parseJson(campaign.author);

  // Priority: campaign.fundraiser.id -> campaign.author.id
  return Number(
    fundraiser?.id ??
      campaign.fundraiser_id ??
      author?.id ??
      campaign.author_id ??
      0
  );
}

export async function syncFundraiserMeta(env: Env) {
  const [fundraisersRes, campaignsRes, donationsRes] = await Promise.all([
    env.growfund_db.prepare(`SELECT id FROM fundraisers`).all(),
    env.growfund_db
      .prepare(`SELECT id, fundraiser, author, status FROM campaigns`)
      .all(),
    env.growfund_db
      .prepare(`SELECT id, campaign_id, amount, status, payment_status FROM donations`)
      .all(),
  ]);

  const fundraisers = fundraisersRes.results || [];
  const campaigns = campaignsRes.results || [];
  const donations = donationsRes.results || [];

  // 1. Map campaign_id -> fundraiserId (via campaigns.fundraiser / campaigns.author)
  //    and count non-trashed campaigns per fundraiser
  const campaignToFundraiser = new Map<number, number>();
  const campaignsCountByFundraiser = new Map<number, number>();

  for (const f of fundraisers) {
    campaignsCountByFundraiser.set(Number(f.id), 0);
  }

  for (const c of campaigns) {
    const campaignStatus = String(c.status ?? "").trim().toLowerCase();
    if (campaignStatus === "trash" || campaignStatus === "trashed") continue;

    const campaignId = Number(c.id || 0);
    const fundraiserId = extractCampaignFundraiserId(c);

    if (campaignId > 0 && fundraiserId > 0) {
      campaignToFundraiser.set(campaignId, fundraiserId);
      campaignsCountByFundraiser.set(
        fundraiserId,
        (campaignsCountByFundraiser.get(fundraiserId) || 0) + 1
      );
    }
  }

  // 2. Aggregate completed donations by matching donations.campaign_id -> campaign's fundraiser
  const totalsByFundraiser = new Map<number, { raised: number; count: number }>();
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

    const fundraiserId = campaignToFundraiser.get(Number(d.campaign_id || 0));
    if (!fundraiserId) continue;

    const amount = Number(d.amount || 0);
    const current = totalsByFundraiser.get(fundraiserId) || { raised: 0, count: 0 };
    current.raised += Number.isFinite(amount) ? amount : 0;
    current.count += 1;
    totalsByFundraiser.set(fundraiserId, current);
  }

  // 3. Upsert the 4 meta keys for every fundraiser
  const allFundraiserIds = new Set<number>([
    ...campaignsCountByFundraiser.keys(),
    ...totalsByFundraiser.keys(),
  ]);

  if (allFundraiserIds.size === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO fundraiser_meta (fundraiser_id, key, value, last_synced_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(fundraiser_id, key) DO UPDATE SET
      value = excluded.value,
      last_synced_at = CURRENT_TIMESTAMP
  `);

  const batch: any[] = [];

  for (const fundraiserId of allFundraiserIds) {
    const totalCampaigns = campaignsCountByFundraiser.get(fundraiserId) || 0;
    const stats = totalsByFundraiser.get(fundraiserId) || { raised: 0, count: 0 };
    const totalRaised = Math.round(stats.raised * 100) / 100;
    const donationsReceived = stats.count;
    const averageDonation =
      donationsReceived > 0
        ? Math.round((totalRaised / donationsReceived) * 100) / 100
        : 0;

    batch.push(
      stmt.bind(fundraiserId, "total_raised", totalRaised.toFixed(2)),
      stmt.bind(fundraiserId, "average_donation", averageDonation.toFixed(2)),
      stmt.bind(fundraiserId, "total_campaigns", String(totalCampaigns)),
      stmt.bind(fundraiserId, "donations_received", String(donationsReceived))
    );
  }

  for (let i = 0; i < batch.length; i += 100) {
    await env.growfund_db.batch(batch.slice(i, i + 100));
  }
}