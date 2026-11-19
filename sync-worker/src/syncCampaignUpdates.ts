import { Env, fetchAllPages } from "./utils";

// Helper for a short cool-down between batches
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function syncCampaignUpdates(env: Env, WP_URL: string, headers: Record<string, string>) {
  // 1. Grab all campaign IDs locally from D1 (Lightning fast)
  const { results } = await env.growfund_db.prepare(`
    SELECT id FROM campaigns
  `).all();

  if (!results || results.length === 0) return;

  const campaignIds = results.map((r: any) => Number(r.id)).filter(id => id > 0);
  
  // We process in small batches since some campaigns might have multiple pages of updates
  const batchSize = 3; 

  const stmt = env.growfund_db.prepare(`
    INSERT INTO campaign_updates (
      id, campaign_id, title, slug, image, description, created_by_id, 
      created_by_name, created_by_role, created_by_image, created_at, comments, likes, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      campaign_id=excluded.campaign_id, title=excluded.title, slug=excluded.slug, 
      image=excluded.image, description=excluded.description, created_by_id=excluded.created_by_id, 
      created_by_name=excluded.created_by_name, created_by_role=excluded.created_by_role, 
      created_by_image=excluded.created_by_image, created_at=excluded.created_at, 
      comments=excluded.comments, likes=excluded.likes, last_synced_at=CURRENT_TIMESTAMP
  `);

  // 2. Loop through campaign IDs and fetch their updates
  for (let i = 0; i < campaignIds.length; i += batchSize) {
    const batch = campaignIds.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (id) => {
        try {
          // fetchAllPages elegantly appends &page=1&per_page=100 to existing query strings
          const updates = await fetchAllPages(`${WP_URL}/campaign/updates/paginated?campaign_id=${id}`, headers, 100);
          
          if (updates && updates.length > 0) {
            const dbBatch = updates.map((u: any) => 
              stmt.bind(
                Number(u.id), 
                Number(u.campaign_id), 
                u.title, 
                u.slug, 
                u.image ? JSON.stringify(u.image) : null, 
                u.description, 
                Number(u.created_by_id || 0), 
                u.created_by_name, 
                u.created_by_role, 
                u.created_by_image ? JSON.stringify(u.created_by_image) : null, 
                u.created_at, 
                Number(u.comments || 0), 
                Number(u.likes || 0)
              )
            );
            
            // Execute the bulk insert for this specific campaign's updates
            await env.growfund_db.batch(dbBatch);
          }
        } catch (err) {
          console.error(`[NETWORK ERROR] Failed to sync updates for Campaign ID ${id}:`, err);
        }
      })
    );

    // Give WordPress a 1-second breather before requesting the next batch of campaigns
    if (i + batchSize < campaignIds.length) {
      await delay(1000); 
    }
  }
}