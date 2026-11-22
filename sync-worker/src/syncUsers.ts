import { Env, fetchAllPages } from "./utils";

export async function syncUsers(env: Env, WP_URL: string, headers: Record<string, string>) {
  const data = await fetchAllPages(`${WP_URL}/users`, headers, 100);
  if (data.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO users (
      id, username, name, email, role, registered_date, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      username=excluded.username,
      name=excluded.name,
      email=excluded.email,
      role=excluded.role,
      registered_date=excluded.registered_date,
      last_synced_at=CURRENT_TIMESTAMP
  `);

  const batch = [];
  for (const u of data) {
    batch.push(
      stmt.bind(
        Number(u.id),
        u.username ?? null,
        u.name ?? null,
        u.email ?? null,
        u.role ?? "",
        u.registered_date ?? null
      )
    );
  }

  if (batch.length > 0) {
    await env.growfund_db.batch(batch);
  }
}