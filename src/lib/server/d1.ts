
import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getD1(): Promise<D1Database> {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const db = (env as typeof env & {
    growfund_db?: D1Database;
  }).growfund_db;

  if (!db) {
    throw new Error("Cloudflare D1 binding growfund_db is unavailable");
  }

  return db;
}

export async function queryD1<T>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[]> {
  const db = await getD1();

  const result = await db
    .prepare(sql)
    .bind(...params)
    .all<T>();

  return result.results ?? [];
}
