const WP_URL = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.hiilbox.com").replace(/\/$/, "");
const GFCM_URL = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL || `${WP_URL}/wp-json/growfund-currency-manager/v1`).replace(/\/$/, "");

export function wcUrl(path = "") { return `${WP_URL}/wp-json/wc/v3${path}`; }
export function gfcmUrl(path = "") { return `${GFCM_URL}${path}`; }
export function gfcmCheckoutUrl(path = "") { return `${WP_URL}/wp-json/gfcm/v1${path}`; }

export function wcAuthHeader(): string {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("WooCommerce REST credentials are not configured on the Next.js server.");
  return `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;
}

export async function systemToken(): Promise<string> {
  const apiKey = process.env.GROWFUND_CLIENT_API_KEY;
  if (!apiKey) throw new Error("GROWFUND_CLIENT_API_KEY is not configured.");
  const response = await fetch(gfcmUrl("/auth/system-token"), {
    method: "POST",
    headers: { Accept: "application/json", "X-API-Key": apiKey },
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.system_access_token) throw new Error(data?.message ?? "Unable to obtain Growfund system token.");
  return data.system_access_token;
}

export function gfcmHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "X-API-Key": process.env.GROWFUND_CLIENT_API_KEY || "",
  };
}
