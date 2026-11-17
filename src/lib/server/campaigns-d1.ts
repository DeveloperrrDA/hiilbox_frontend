
import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type CampaignRow = Record<string, unknown>;

export type D1CampaignQuery = {
  page?: number;
  per_page?: number;
  search?: string;
  category_slug?: string;
  status?: string;
  is_featured?: boolean;
  orderby?: string;
  order?: "asc" | "desc";
};

const jsonFields = [
  "images", "video", "author", "fundraiser",
  "tags", "collaborators", "suggested_options",
  "faqs", "rewards", "tribute_options",
  "default_fund", "fund_choices",
];

const booleanFields = [
  "has_goal", "is_half_goal_achieved_already",
  "allow_custom_donation", "allow_pledge_without_reward",
  "is_backed", "is_interactive", "is_launched",
  "is_ended", "is_paused", "is_hidden",
  "is_featured", "is_bookmarked", "allow_local_pickup",
  "is_ready_for_pickup", "provide_confirmation_pdf_receipt",
  "has_tribute", "show_collaborator_list",
];

function decodeRow(row: CampaignRow): CampaignRow {
  const result = { ...row };

  for (const field of jsonFields) {
    if (typeof result[field] === "string") {
      try {
        result[field] = JSON.parse(result[field] as string);
      } catch {
        result[field] = null;
      }
    }
  }

  for (const field of booleanFields) {
    if (result[field] !== null && result[field] !== undefined) {
      result[field] = Boolean(result[field]);
    }
  }

  if (typeof result.extra_data === "string") {
    try {
      const extra = JSON.parse(result.extra_data);
      if (extra && typeof extra === "object" && !Array.isArray(extra)) {
        for (const [key, value] of Object.entries(extra)) {
          if (!(key in result)) result[key] = value;
        }
      }
    } catch {
      // Preserve the main campaign record.
    }
  }

  return result;
}


async function getDB(): Promise<any | null> {
  if (process.env.CAMPAIGNS_D1_ENABLED !== "true") {
    console.warn("[D1] Campaign D1 access is disabled");
    return null;
  }

  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const db = (env as any).growfund_db;

    if (!db) {
      console.error("[D1] growfund_db binding is missing");
      return null;
    }

    return db;
  } catch (error) {
    console.error("[D1] Failed to access database:", error);
    return null;
  }
}


export async function getD1Campaigns(
  query: D1CampaignQuery = {}
) {
  const db = await getDB();
  if (!db) return null;

  try {
    const page = Math.max(1, Math.floor(Number(query.page) || 1));
    const perPage = Math.min(
      100,
      Math.max(1, Math.floor(Number(query.per_page) || 10))
    );

    const where: string[] = [
      "status = 'published'",
      "COALESCE(is_hidden, 0) = 0",
    ];
    const bindings: unknown[] = [];

    if (query.search?.trim()) {
      where.push("(title LIKE ? OR description LIKE ?)");
      const term = `%${query.search.trim()}%`;
      bindings.push(term, term);
    }

    if (query.category_slug?.trim()) {
      where.push("category = ?");
      bindings.push(query.category_slug.trim());
    }

    if (query.is_featured !== undefined) {
      where.push("is_featured = ?");
      bindings.push(query.is_featured ? 1 : 0);
    }

    const allowedSorts: Record<string, string> = {
      created_at: "id",
      start_date: "start_date",
      end_date: "end_date",
      id: "id",
      goal_amount: "goal_amount",
      fund_raised: "fund_raised",
    };

    const sortColumn =
      allowedSorts[query.orderby ?? ""] ?? "id";
    const direction = query.order === "asc" ? "ASC" : "DESC";
    const whereSQL = where.join(" AND ");

    const count = await db
      .prepare(`SELECT COUNT(*) AS total FROM campaigns WHERE ${whereSQL}`)
      .bind(...bindings)
      .first();

    const rows = await db
      .prepare(
        `SELECT * FROM campaigns
         WHERE ${whereSQL}
         ORDER BY ${sortColumn} ${direction}, id DESC
         LIMIT ? OFFSET ?`
      )
      .bind(...bindings, perPage, (page - 1) * perPage)
      .all();

    const total = Number(count?.total ?? 0);

const campaignRows = (rows.results ?? []).map(decodeRow);

const donationTotals = await getD1DonationTotals(
  
campaignRows.map((campaign: CampaignRow) => Number(campaign.id))

);


const campaignsWithDonations = campaignRows.map((campaign: CampaignRow) => {

  const totals = donationTotals.get(Number(campaign.id));

  return {
    ...campaign,
    number_of_contributions: totals?.completed_count ?? 0,
    number_of_contributors: totals?.completed_count ?? 0,
    number_of_individual_contributions:
      totals?.completed_count ?? 0,
  };
});

    return {
      success: true,
      data: campaignsWithDonations,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  } catch (error) {
    console.error("[D1] Campaign listing failed:", error);
    return null;
  }
}

export async function getD1Campaign(id: number) {
  const db = await getDB();
  if (!db || !Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  try {
    const row = await db
      .prepare(
        `SELECT * FROM campaigns
         WHERE id = ?
         AND status = 'published'
         AND COALESCE(is_hidden, 0) = 0
         LIMIT 1`
      )
      .bind(id)
      .first();

    if (!row) return null;

const totals = await getD1DonationTotals([id]);
const donationSummary = totals.get(id);

const campaignWithDonations = {
  ...decodeRow(row),
  number_of_contributions:
    donationSummary?.completed_count ?? 0,
  number_of_contributors:
    donationSummary?.completed_count ?? 0,
  number_of_individual_contributions:
    donationSummary?.completed_count ?? 0,
};

    return {
      success: true,
      data: campaignWithDonations,
    };
  } catch (error) {
    console.error("[D1] Campaign detail failed:", error);
    return null;
  }
}

export async function getD1DonationTotals(
  campaignIds: number[]
): Promise<
  Map<number, { completed_count: number; total_raised: number }>
> {
  const totals = new Map<
    number,
    { completed_count: number; total_raised: number }
  >();

  if (campaignIds.length === 0) {
    return totals;
  }

  const db = await getDB();

  if (!db) {
    throw new Error("D1 database is unavailable");
  }

  const ids = [
    ...new Set(
      campaignIds.filter(
        (id) => Number.isSafeInteger(id) && id > 0
      )
    ),
  ];

  if (ids.length === 0) {
    return totals;
  }

  const placeholders = ids.map(() => "?").join(",");

  const result = await db
    .prepare(
      `SELECT
         campaign_id,
         COUNT(*) AS completed_count,
         ROUND(COALESCE(SUM(amount), 0), 2) AS total_raised
       FROM donations
       WHERE status = 'completed'
         AND payment_status = 'paid'
         AND campaign_id IN (${placeholders})
       GROUP BY campaign_id`
    )
    .bind(...ids)
    .all();

  for (const row of result.results ?? []) {
    totals.set(Number(row.campaign_id), {
      completed_count: Number(row.completed_count ?? 0),
      total_raised: Number(row.total_raised ?? 0),
    });
  }

  return totals;
}
