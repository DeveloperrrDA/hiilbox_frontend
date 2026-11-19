import { Env } from "./utils";

// Helper for a short cool-down between batches
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function syncMetadata(env: Env, WP_URL: string, headers: Record<string, string>) {
  // 1. Query the local D1 database for ALL IDs
  const { results } = await env.growfund_db.prepare(`
    SELECT id FROM fundraisers
  `).all();

  if (!results || results.length === 0) {
    return;
  }

  const fundraiserIds = results.map((r: any) => Number(r.id)).filter(id => id > 0);
  let totalPayable = 0;
  
  // Process 5 fundraisers at a time to keep execution under 30 seconds
  const batchSize = 5; 

  // 2. Loop through IDs in small batches 
  for (let i = 0; i < fundraiserIds.length; i += batchSize) {
    const batch = fundraiserIds.slice(i, i + batchSize);
    
    const amounts = await Promise.all(
      batch.map(async (id) => {
        try {
          const res = await fetch(`${WP_URL}/wallet/info?fundraiser_id=${id}`, {
            method: "GET",
            headers: {
              "Authorization": headers["Authorization"],
              "X-API-Key": headers["X-API-Key"],
              "Accept": "application/json"
            }
          });
          
          if (!res.ok) {
            // Silently ignore 404s (empty wallets), log other errors
            if (res.status !== 404) {
              console.error(`[ERROR] Wallet API failed for Fundraiser ID ${id}: HTTP ${res.status}`);
            }
            return 0;
          }
          
          const json = await (res.json() as any);
          const available = Number(json?.data?.available_withdraw_amount || 0);
          
          return Number.isFinite(available) && available > 0 ? available : 0;
        } catch (err) {
          console.error(`[NETWORK ERROR] Fundraiser ID ${id}:`, err);
          return 0; 
        }
      })
    );

    totalPayable += amounts.reduce((sum, amount) => sum + amount, 0);

    // Pause for 1 second between batches to avoid overwhelming WordPress
    if (i + batchSize < fundraiserIds.length) {
      await delay(1000); 
    }
  }

  // Only log the final success message
  console.log(`Successfully calculated Total Payable: ${totalPayable}`);

  // 3. Upsert the total_payable value into the metadata table
  const stmt = env.growfund_db.prepare(`
    INSERT INTO metadata (key, value, last_synced_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET 
      value=excluded.value, 
      last_synced_at=CURRENT_TIMESTAMP
  `);

  await stmt.bind("total_payable", String(totalPayable)).run();
}