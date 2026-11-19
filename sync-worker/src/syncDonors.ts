import { Env, fetchAllPages } from "./utils";

export async function syncDonors(env: Env, WP_URL: string, headers: Record<string, string>) {
  const [activeDonors, trashedDonors] = await Promise.all([
    fetchAllPages(`${WP_URL}/donors?status=all&orderby=id&order=desc`, headers, 100),
    fetchAllPages(`${WP_URL}/donors?status=trashed&orderby=id&order=desc`, headers, 100)
  ]);
  
  const data = [
    ...activeDonors.map((d: any) => ({ ...d, status: d.status || 'active' })),
    ...trashedDonors.map((d: any) => ({ ...d, status: 'trash' }))
  ];
  if (data.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO donors (
      id, first_name, last_name, email, username, phone, image, billing_address,
      joined_at, is_verified, is_fundraiser, latest_donation_date, total_contributions,
      number_of_contributions, created_by, status, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      first_name=excluded.first_name, last_name=excluded.last_name, email=excluded.email, 
      username=excluded.username, phone=excluded.phone, image=excluded.image, 
      billing_address=excluded.billing_address, joined_at=excluded.joined_at, 
      is_verified=excluded.is_verified, is_fundraiser=excluded.is_fundraiser, 
      latest_donation_date=excluded.latest_donation_date, total_contributions=excluded.total_contributions, 
      number_of_contributions=excluded.number_of_contributions, created_by=excluded.created_by, 
      status=excluded.status, last_synced_at=CURRENT_TIMESTAMP
  `);

  const batch = [];
  for (const d of data) {
    batch.push(
      stmt.bind(
        Number(d.id), d.first_name, d.last_name, d.email, d.username, d.phone, 
        d.image ? JSON.stringify(d.image) : null, 
        d.billing_address ? JSON.stringify(d.billing_address) : null, 
        d.joined_at, d.is_verified ? 1 : 0, d.is_fundraiser ? 1 : 0, 
        d.latest_donation_date, Number(d.total_contributions || 0), 
        Number(d.number_of_contributions || 0), Number(d.created_by || 0), 
        d.status
      )
    );
  }
  if (batch.length > 0) await env.growfund_db.batch(batch);
}