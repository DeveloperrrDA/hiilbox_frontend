
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  apiBase,
  growfundJson,
  requireUser,
} from "@/app/api/dashboard/campaigns/_server";

import { isAdminUser } from "@/app/api/dashboard/_owned";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetadataRow = {
  value: string | null;
  last_synced_at: string | null;
};

type CountRow = {
  total: number;
};

export async function GET(req: NextRequest) {
  // Require authenticated user
  const auth = await requireUser(req);

  if ("error" in auth) {
    return auth.error;
  }

  try {
    // Verify WordPress administrator permissions
    const me = await growfundJson(`${apiBase}/auth/me`, {
      headers: {
        Authorization: auth.authorization,
      },
    });

    if (!me.response.ok) {
      return NextResponse.json(me.data, {
        status: me.response.status,
      });
    }

    if (!isAdminUser(me.data)) {
      return NextResponse.json(
        { message: "Administrator access required." },
        { status: 403 }
      );
    }

    // Connect to Cloudflare D1
    const { env } = await getCloudflareContext({
      async: true,
    });

   
const db = (
  env as typeof env & {
    growfund_db: {
      prepare: (query: string) => {
        bind: (...values: (string | number | null)[]) => {
          first: <T>() => Promise<T | null>;
        };
        first: <T>() => Promise<T | null>;
      };
    };
  }
).growfund_db;


    if (!db) {
      throw new Error("Cloudflare D1 binding unavailable.");
    }

    // Fetch total payable from metadata
    const metadata = await db
      .prepare(
        `SELECT value, last_synced_at
         FROM metadata
         WHERE key = ?
         LIMIT 1`
      )
      .bind("total_payable")
      .first<MetadataRow>();

    if (!metadata || metadata.value === null) {
      throw new Error("Total payable metadata not found.");
    }

    const rawValue = metadata.value.trim();

    if (!rawValue) {
      throw new Error("Total payable metadata is empty.");
    }

    const totalPayable = Number(rawValue);

    if (!Number.isFinite(totalPayable) || totalPayable < 0) {
      throw new Error("Invalid total payable value in D1.");
    }

    // Fetch total fundraiser count
    const count = await db
      .prepare(
        `SELECT COUNT(*) AS total
         FROM fundraisers`
      )
      .first<CountRow>();

    return NextResponse.json(
      {
        success: true,
        total_payable: Math.round(totalPayable * 100) / 100,
        fundraiser_count: count?.total ?? 0,
        last_synced_at: metadata.last_synced_at,
        source: "cloudflare_d1",
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("[Total Payable D1]", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to retrieve total payable.",
      },
      {
        status: 500,
      }
    );
  }
}
