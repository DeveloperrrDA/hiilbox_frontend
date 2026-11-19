import { Env, fetchAllPages } from "./utils";

export async function syncDonations(env: Env, WP_URL: string, headers: Record<string, string>) {
  const [activeDonations, trashedDonations] = await Promise.all([
    fetchAllPages(`${WP_URL}/donations/recent?orderby=created_at&order=DESC`, headers, 100),
    fetchAllPages(`${WP_URL}/donations/recent?status=trashed&orderby=created_at&order=DESC`, headers, 100)
  ]);
  
  const data = [
    ...activeDonations,
    ...trashedDonations.map((d: any) => ({ ...d, status: 'trash' }))
  ];
  if (data.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO donations (
      id, uid, campaign, fund, donor, amount, 
      tribute_type, tribute_salutation, tribute_to, tribute_notification_type, tribute_notification_recipient_name, tribute_notification_recipient_phone, tribute_notification_recipient_email, tribute_notification_recipient_address, 
      notes, status, transaction_id, payment_method, payment_status, is_anonymous, is_manual, 
      created_at, updated_at, processing_fee, gateway_fee, platform_fee, tip_amount, 
      campaign_id, donor_id, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?, 
      ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      uid=excluded.uid, campaign=excluded.campaign, fund=excluded.fund, donor=excluded.donor, amount=excluded.amount,
      tribute_type=excluded.tribute_type, tribute_salutation=excluded.tribute_salutation, tribute_to=excluded.tribute_to, tribute_notification_type=excluded.tribute_notification_type, tribute_notification_recipient_name=excluded.tribute_notification_recipient_name, tribute_notification_recipient_phone=excluded.tribute_notification_recipient_phone, tribute_notification_recipient_email=excluded.tribute_notification_recipient_email, tribute_notification_recipient_address=excluded.tribute_notification_recipient_address,
      notes=excluded.notes, status=excluded.status, transaction_id=excluded.transaction_id, payment_method=excluded.payment_method, payment_status=excluded.payment_status, is_anonymous=excluded.is_anonymous, is_manual=excluded.is_manual, 
      created_at=excluded.created_at, updated_at=excluded.updated_at, processing_fee=excluded.processing_fee, gateway_fee=excluded.gateway_fee, platform_fee=excluded.platform_fee, tip_amount=excluded.tip_amount, 
      campaign_id=excluded.campaign_id, donor_id=excluded.donor_id, last_synced_at=CURRENT_TIMESTAMP
  `);

  const batch = [];
  for (const d of data) {
    batch.push(
      stmt.bind(
        Number(d.id), d.uid, 
        d.campaign ? JSON.stringify(d.campaign) : null, 
        d.fund ? JSON.stringify(d.fund) : null, 
        d.donor ? JSON.stringify(d.donor) : null, 
        Number(d.amount || 0), 
        d.tribute_type, d.tribute_salutation, d.tribute_to, d.tribute_notification_type, d.tribute_notification_recipient_name, d.tribute_notification_recipient_phone, d.tribute_notification_recipient_email, d.tribute_notification_recipient_address, 
        d.notes, d.status, d.transaction_id, 
        d.payment_method ? JSON.stringify(d.payment_method) : null, 
        d.payment_status, d.is_anonymous ? 1 : 0, d.is_manual ? 1 : 0, 
        d.created_at, d.updated_at, 
        Number(d.processing_fee || 0), Number(d.gateway_fee || 0), Number(d.platform_fee || 0), Number(d.tip_amount || 0), 
        Number(d.campaign?.id || 0), Number(d.donor?.id || 0)
      )
    );
  }
  if (batch.length > 0) await env.growfund_db.batch(batch);
}