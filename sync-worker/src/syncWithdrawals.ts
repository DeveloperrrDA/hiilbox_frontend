import { Env, fetchAllPages } from "./utils";

export async function syncWithdrawalRequests(env: Env, WP_URL: string, headers: Record<string, string>) {
  const data = await fetchAllPages(`${WP_URL}/fundraiser/withdrawal/requests?orderby=id&order=desc`, headers, 100);
  if (data.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO withdrawal_requests (
      id, fundraiser, fundraiser_id, amount, method, status, note, 
      has_attachment, created_at, updated_by, updated_at, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      fundraiser=excluded.fundraiser, fundraiser_id=excluded.fundraiser_id, amount=excluded.amount, 
      method=excluded.method, status=excluded.status, note=excluded.note, has_attachment=excluded.has_attachment, 
      created_at=excluded.created_at, updated_by=excluded.updated_by, updated_at=excluded.updated_at, 
      last_synced_at=CURRENT_TIMESTAMP
  `);

  const batch = [];
  for (const w of data) {
    batch.push(
      stmt.bind(
        Number(w.id),
        w.fundraiser ? JSON.stringify(w.fundraiser) : null,
        Number(w.fundraiser?.id || 0),
        Number(w.amount || 0),
        w.method,
        w.status,
        w.note,
        w.has_attachment ? 1 : 0,
        w.created_at,
        w.updated_by ? Number(w.updated_by) : null,
        w.updated_at
      )
    );
  }
  if (batch.length > 0) await env.growfund_db.batch(batch);
}