import { Env, fetchAllPages } from "./utils";

function serializeJson(val: any): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "string") return val;
  try {
    return JSON.stringify(val);
  } catch {
    return null;
  }
}

function toNullableInt(val: any): number | null {
  if (val === null || val === undefined || val === "") return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}

export async function syncActivities(
  env: Env,
  WP_URL: string,
  headers: Record<string, string>
) {
  const rows = await fetchAllPages(`${WP_URL}/activities/paginated`, headers, 100);
  if (rows.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO activities (
      id, type, campaign_id, pledge_id, donation_id,
      data, user_id, created_by, created_at, meta, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      type = excluded.type,
      campaign_id = excluded.campaign_id,
      pledge_id = excluded.pledge_id,
      donation_id = excluded.donation_id,
      data = excluded.data,
      user_id = excluded.user_id,
      created_by = excluded.created_by,
      created_at = excluded.created_at,
      meta = excluded.meta,
      last_synced_at = CURRENT_TIMESTAMP
  `);

  const batch: any[] = [];
  for (const a of rows) {
    const id = toNullableInt(a.id);
    if (id === null) continue;

    batch.push(
      stmt.bind(
        id,
        a.type ?? null,
        toNullableInt(a.campaign_id),
        toNullableInt(a.pledge_id),
        toNullableInt(a.donation_id),
        serializeJson(a.data),
        toNullableInt(a.user_id),
        toNullableInt(a.created_by),
        a.created_at ?? null,
        serializeJson(a.meta)
      )
    );
  }

  for (let i = 0; i < batch.length; i += 100) {
    await env.growfund_db.batch(batch.slice(i, i + 100));
  }
}