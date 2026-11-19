
import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Statement = {
  bind: (...values: (string | number | null)[]) => D1Statement;
  all: () => Promise<{ results?: Record<string, unknown>[] }>;
  first: <T>() => Promise<T | null>;
};

type D1Connection = {
  prepare: (sql: string) => D1Statement;
};

type Listing = "donors" | "fundraisers" | "withdrawals";

const definitions = {
  donors: {
    table: "donors",
    search: ["first_name", "last_name", "email", "username", "phone"],
    json: ["image", "billing_address"],
    boolean: ["is_verified", "is_fundraiser"],
  },
  fundraisers: {
    table: "fundraisers",
    search: ["first_name", "last_name", "email", "username", "phone"],
    json: ["image", "decline_reason"],
    boolean: ["is_verified"],
  },
  withdrawals: {
    table: "withdrawal_requests",
    search: ["note", "method"],
    json: ["fundraiser"],
    boolean: ["has_attachment"],
  },
} as const;

function decode(
  row: Record<string, unknown>,
  jsonFields: readonly string[],
  booleanFields: readonly string[]
) {
  const result = { ...row };

  for (const field of jsonFields) {
    const value = result[field];

    if (typeof value === "string" && value.trim()) {
      try {
        result[field] = JSON.parse(value);
      } catch {
        // Preserve original data if it isn't valid JSON.
      }
    }
  }

  for (const field of booleanFields) {
    if (result[field] !== null && result[field] !== undefined) {
      result[field] = Boolean(result[field]);
    }
  }

  return result;
}

export async function readAdminD1(
  listing: Listing,
  params: URLSearchParams
) {
  const { env } = await getCloudflareContext({ async: true });

  const db = (
    env as typeof env & { growfund_db?: D1Connection }
  ).growfund_db;

  if (!db) throw new Error("D1 binding unavailable");

  const config = definitions[listing];

  const page = Math.max(
    1,
    Math.floor(Number(params.get("page")) || 1)
  );

  const perPage = Math.min(
    100,
    Math.max(1, Math.floor(Number(params.get("per_page")) || 20))
  );

  const where: string[] = [];
  const bindings: (string | number | null)[] = [];

  const status = params.get("status")?.trim();

  if (status && status.toLowerCase() !== "all") {
    where.push("status = ?");
    bindings.push(status);
  }

  const search = params.get("search")?.trim();

  if (search) {
    const fields = config.search;

    where.push(
      "(" + fields.map((field) => `${field} LIKE ?`).join(" OR ") + ")"
    );

    for (const _field of fields) {
      bindings.push(`%${search}%`);
    }
  }

  if (listing === "withdrawals") {
    const fundraiserId = Number(params.get("fundraiser_id"));

    if (Number.isSafeInteger(fundraiserId) && fundraiserId > 0) {
      where.push("fundraiser_id = ?");
      bindings.push(fundraiserId);
    }
  }

  const whereSql = where.length
    ? `WHERE ${where.join(" AND ")}`
    : "";

  const countResult = await db
    .prepare(
      `SELECT COUNT(*) AS total
       FROM ${config.table}
       ${whereSql}`
    )
    .bind(...bindings)
    .first<{ total: number }>();

  const total = Number(countResult?.total ?? 0);
  const offset = (page - 1) * perPage;

  const result = await db
    .prepare(
      `SELECT *
       FROM ${config.table}
       ${whereSql}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`
    )
    .bind(...bindings, perPage, offset)
    .all();

  const rows = (result.results ?? []).map((row) =>
    decode(row, config.json, config.boolean)
  );

  return {
    success: true,
    data: rows,
    total,
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
  };
}
