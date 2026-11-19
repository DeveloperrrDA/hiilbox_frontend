import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CampaignUpdate } from "@/lib/campaigns";

export async function getD1CampaignUpdates(params: {
  campaign_id: number;
  page?: number;
  per_page?: number;
}) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    
    // Explicitly type and access your D1 binding
    const db = (env as any).growfund_db;
    if (!db) return null;

    const page = Number(params.page || 1);
    const limit = Number(params.per_page || 10);
    const offset = (page - 1) * limit;

    // 1. Get total count for pagination
    const countQuery = await db
      .prepare(`SELECT COUNT(*) as total FROM campaign_updates WHERE campaign_id = ?`)
      .bind(params.campaign_id)
      .first();
      
    const total = Number(countQuery?.total || 0);

    // 2. Fetch the paginated rows
    const { results } = await db
      .prepare(`
        SELECT * FROM campaign_updates 
        WHERE campaign_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `)
      .bind(params.campaign_id, limit, offset)
      .all();

    if (!results) return null;

    // 3. Hydrate JSON columns and normalize to CampaignUpdate interface
    const updates: CampaignUpdate[] = results.map((row: any) => ({
      id: Number(row.id),
      campaign_id: Number(row.campaign_id),
      title: String(row.title || ""),
      slug: String(row.slug || ""),
      image: row.image ? JSON.parse(row.image) : [],
      description: String(row.description || ""),
      created_by_id: Number(row.created_by_id || 0),
      created_by_name: String(row.created_by_name || ""),
      created_by_role: String(row.created_by_role || ""),
      created_by_image: row.created_by_image ? JSON.parse(row.created_by_image)?.url || "" : "",
      created_at: String(row.created_at || ""),
      comments: Number(row.comments || 0),
      likes: Number(row.likes || 0),
    }));

    return {
      success: true,
      data: updates,
      pagination: {
        page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("D1 Campaign Updates Fetch Error:", error);
    return null;
  }
}