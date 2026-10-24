import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";
const API_KEY = process.env.GROWFUND_CLIENT_API_KEY || process.env.NEXT_PUBLIC_GROWFUND_CLIENT_API_KEY || "";

const UPDATES_CACHE_MS = 5 * 60 * 1000;

type CachedUpdate = {
  data: unknown;
  status: number;
  expiresAt: number;
};

const updatesCache = new Map<string, CachedUpdate>();

const pendingUpdates = new Map<
  string,
  Promise<{ data: unknown; status: number }>
>();


export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      {
        success: false,
        message: "GROWFUND_CLIENT_API_KEY is not configured",
      },
      { status: 500 }
    );
  }

  const cacheKey = request.nextUrl.searchParams.toString();
  const cached = updatesCache.get(cacheKey);

  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.data, {
      status: cached.status,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Hiilbox-Cache": "HIT",
      },
    });
  }

  try {
    let pending = pendingUpdates.get(cacheKey);

    if (!pending) {
      pending = (async () => {
        const tokenRes = await fetch(
          `${WORDPRESS_API}/auth/system-token`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-API-Key": API_KEY,
            },
            cache: "no-store",
          }
        );

        const tokenData = await tokenRes.json().catch(() => null);
        const systemToken = tokenData?.system_access_token;

        if (!tokenRes.ok || !systemToken) {
          return {
            data: tokenData || {
              success: false,
              message: "Unable to obtain system token",
            },
            status: tokenRes.ok ? 502 : tokenRes.status,
          };
        }

        const target = new URL(
          `${WORDPRESS_API}/campaign/updates/paginated`
        );

        request.nextUrl.searchParams.forEach((value, key) => {
          target.searchParams.set(key, value);
        });

        const response = await fetch(target, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${systemToken}`,
            "X-API-Key": API_KEY,
          },
          cache: "no-store",
        });

        const text = await response.text();

        let data: unknown = null;

        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = {
            success: false,
            message: "WordPress returned invalid JSON",
          };
        }

        return { data, status: response.status };
      })();

      pendingUpdates.set(cacheKey, pending);

      void pending
        .finally(() => {
          pendingUpdates.delete(cacheKey);
        })
        .catch(() => {});
    }

    const result = await pending;

    if (
      result.status >= 200 &&
      result.status < 300 &&
      result.data !== null &&
      typeof result.data === "object" &&
      (result.data as { success?: boolean }).success !== false
    ) {
      updatesCache.set(cacheKey, {
        data: result.data,
        status: result.status,
        expiresAt: Date.now() + UPDATES_CACHE_MS,
      });
    }

    return NextResponse.json(result.data, {
      status: result.status,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Hiilbox-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Campaign updates fetch failed:", error);

    if (cached) {
      return NextResponse.json(cached.data, {
        status: cached.status,
        headers: {
          "Cache-Control": "private, no-store",
          "X-Hiilbox-Cache": "STALE",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load campaign updates",
      },
      { status: 500 }
    );
  }
}

