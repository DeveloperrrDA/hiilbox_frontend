
import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Statement = {
  bind: (...values: (string | number | null)[]) => D1Statement;
  all: () => Promise<{
    results?: Record<string, unknown>[];
  }>;
  first: <T>() => Promise<T | null>;
};

type D1Connection = {
  prepare: (sql: string) => D1Statement;
};

type Listing = "donors" | "fundraisers" | "withdrawals";

const definitions = {
  donors: {
    table: "donors",
    search: [
      "first_name",
      "last_name",
      "email",
      "username",
      "phone",
    ],
    json: ["image", "billing_address"],
    boolean: ["is_verified", "is_fundraiser"],
  },

  fundraisers: {
    table: "fundraisers",
    search: [
      "first_name",
      "last_name",
      "email",
      "username",
      "phone",
    ],
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
): Record<string, unknown> {
  const result = { ...row };

  for (const field of jsonFields) {
    const value = result[field];

    if (typeof value === "string" && value.trim()) {
      try {
        result[field] = JSON.parse(value);
      } catch {
        // Preserve the original value if not valid JSON.
      }
    }
  }

  for (const field of booleanFields) {
    const value = result[field];

    if (value !== null && value !== undefined) {
      result[field] =
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true";
    }
  }

  // WordPress returns record IDs as strings.
  if (result.id !== null && result.id !== undefined) {
    result.id = String(result.id);
  }

  // Match the nested fundraiser ID format.
  if (
    result.fundraiser &&
    typeof result.fundraiser === "object" &&
    !Array.isArray(result.fundraiser)
  ) {
    const fundraiser = {
      ...(result.fundraiser as Record<string, unknown>),
    };

    if (
      fundraiser.id !== null &&
      fundraiser.id !== undefined
    ) {
      fundraiser.id = String(fundraiser.id);
    }

    result.fundraiser = fundraiser;
  }

  return result;
}

export async function readAdminD1(
  listing: Listing,
  params: URLSearchParams
) {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const db = (
    env as typeof env & {
      growfund_db?: D1Connection;
    }
  ).growfund_db;

  if (!db) {
    throw new Error("D1 binding unavailable");
  }

  const config = definitions[listing];

  // ==========================================
  // PAGINATION
  // ==========================================

  const page = Math.max(
    1,
    Math.floor(Number(params.get("page")) || 1)
  );

  const perPage = Math.min(
    100,
    Math.max(
      1,
      Math.floor(Number(params.get("per_page")) || 100)
    )
  );

  // ==========================================
  // FILTERS
  // ==========================================

  const where: string[] = [];

  const bindings: (string | number | null)[] = [];

  const status = params.get("status")?.trim();

  // Donors and fundraisers exclude trash
  // from the default WordPress listing.
  if (listing === "donors" || listing === "fundraisers") {
    if (!status || status.toLowerCase() === "all") {
      where.push("status != ?");
      bindings.push("trash");
    } else {
      where.push("status = ?");
      bindings.push(status);
    }
  } else if (status && status.toLowerCase() !== "all") {
    // Preserve withdrawal status filtering.
    where.push("status = ?");
    bindings.push(status);
  }

  // ==========================================
  // SEARCH
  // ==========================================

  const search = params.get("search")?.trim();

  if (search) {
    const fields = config.search;

    where.push(
      "(" +
        fields
          .map((field) => `${field} LIKE ?`)
          .join(" OR ") +
        ")"
    );

    for (const _field of fields) {
      bindings.push(`%${search}%`);
    }
  }

  // ==========================================
  // WITHDRAWAL FUNDRAISER FILTER
  // ==========================================

  if (listing === "withdrawals") {
    const fundraiserId = Number(
      params.get("fundraiser_id")
    );

    if (
      Number.isSafeInteger(fundraiserId) &&
      fundraiserId > 0
    ) {
      where.push("fundraiser_id = ?");
      bindings.push(fundraiserId);
    }
  }

  const whereSql = where.length
    ? `WHERE ${where.join(" AND ")}`
    : "";

  // ==========================================
  // COUNT FILTERED RECORDS
  // ==========================================

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

  // ==========================================
  // FETCH RECORDS
  // ==========================================

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

  // ==========================================
  // COUNT ALL RECORDS
  // ==========================================

  const overallResult = await db
    .prepare(
      `SELECT COUNT(*) AS total
       FROM ${config.table}`
    )
    .first<{ total: number }>();

  const overall = Number(overallResult?.total ?? 0);

  // ==========================================
  // WORDPRESS-COMPATIBLE RESPONSE
  // ==========================================

  return {
    success: true,
    data: {
      results: rows,
      count: rows.length,
      total,
      current_page: page,
      per_page: perPage,
      has_more: page * perPage < total,
      overall,
    },
  };
}
