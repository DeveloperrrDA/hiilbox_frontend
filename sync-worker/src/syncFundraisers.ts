import { Env, fetchAllPages } from "./utils";

export async function syncFundraisers(env: Env, WP_URL: string, headers: Record<string, string>) {
  const [activeFundraisers, trashedFundraisers] = await Promise.all([
    fetchAllPages(`${WP_URL}/fundraisers?status=all&orderby=id&order=desc`, headers, 100),
    fetchAllPages(`${WP_URL}/fundraisers?status=trashed&orderby=id&order=desc`, headers, 100)
  ]);

  const data = [
    ...activeFundraisers.map((f: any) => ({ ...f, status: f.status || 'active' })),
    ...trashedFundraisers.map((f: any) => ({ ...f, status: 'trash' }))
  ];
  if (data.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO fundraisers (
      id, total_campaign_created, first_name, last_name, email, username, phone, image,
      joined_at, status, decline_reason, is_verified, created_by, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      total_campaign_created=excluded.total_campaign_created, first_name=excluded.first_name, last_name=excluded.last_name, email=excluded.email,
      username=excluded.username, phone=excluded.phone, image=excluded.image, joined_at=excluded.joined_at,
      status=excluded.status, decline_reason=excluded.decline_reason, is_verified=excluded.is_verified, created_by=excluded.created_by,
      last_synced_at=CURRENT_TIMESTAMP
  `);

  const batch = [];
  for (const f of data) {
    batch.push(
      stmt.bind(
        Number(f.id),
        Number(f.total_campaign_created || 0),
        f.first_name,
        f.last_name,
        f.email,
        f.username,
        f.phone,
        f.image ? JSON.stringify(f.image) : null,
        f.joined_at,
        f.status,
        typeof f.decline_reason === 'object' && f.decline_reason !== null ? JSON.stringify(f.decline_reason) : f.decline_reason,
        f.is_verified ? 1 : 0,
        f.created_by ? Number(f.created_by) : null
      )
    );
  }
  if (batch.length > 0) await env.growfund_db.batch(batch);
}