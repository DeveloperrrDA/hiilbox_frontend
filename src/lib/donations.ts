export interface CheckoutGateway {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  enabled?: boolean;
  requires_account?: boolean;
}

export interface CheckoutCurrency {
  code: string;
  name: string;
  rate: number;
}

export interface CheckoutInput {
  campaign_id: number;
  amount: number;
  currency: string;
  tip_amount?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address_2?: string;
  city: string;
  state?: string;
  zip_code: string;
  country: string;
  payment_method: string;
  wallet_number?: string;
  is_anonymous?: boolean;
  user_id?: number;
}

export interface CheckoutResult {
  success: boolean;
  order_id: number;
  transaction_id: string | null;
  payment_method: string;
  status: string;
  payment_status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  user_id: number | null;
  donation_id: number | null;
  redirect_url?: string | null;
  redirect?: string | null;
  order_key?: string;
  nextjs_success_path?: string | null;
}

export interface Donation {
  id: string | number;
  donor_name?: string | null;
  is_anonymous?: boolean;
  amount: number | string;
  currency?: string | null;
  created_at?: string | null;
}

async function json<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? data?.error ?? data?.code ?? "Checkout request failed.");
  }
  return data as T;
}


export async function getCheckoutCurrencies(): Promise<CheckoutCurrency[]> {
  const response = await fetch("/api/checkout/currencies", { cache: "no-store" });
  const data = await json<{ currencies?: CheckoutCurrency[] }>(response);
  return Array.isArray(data.currencies) ? data.currencies : [];
}

export async function getCheckoutGateways(): Promise<CheckoutGateway[]> {
  const response = await fetch("/api/checkout/gateways", { cache: "no-store" });
  const data = await json<unknown>(response);
  const raw = Array.isArray(data) ? data : (data as { gateways?: unknown[] })?.gateways ?? [];
  return raw
    .map((gateway: any) => ({
      id: String(gateway.id ?? ""),
      title: String(gateway.title ?? gateway.method_title ?? gateway.id ?? "Payment"),
      description: gateway.description ? String(gateway.description) : undefined,
      enabled: gateway.enabled !== false,
      requires_account: gateway.requires_account ?? ["zes_pay", "edahab_pay", "premier_wallet_pay"].includes(String(gateway.id ?? "")),
    }))
    .filter((gateway) => gateway.id && gateway.enabled !== false);
}

export async function processCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  // Order creation stays with WooCommerce's official wc/v3/orders endpoint.
  const orderResponse = await fetch("/api/checkout/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const order = await json<{ id: number; order_key: string }>(orderResponse);

  // Payment is delegated to the registered WooCommerce gateway. Next.js never calls Sifalo.
  const paymentResponse = await fetch("/api/checkout/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: order.id, account: input.wallet_number?.trim() || input.phone.trim() }),
  });
  const payment = await json<CheckoutResult>(paymentResponse);
  return { ...payment, order_key: order.order_key, redirect: payment.redirect_url ?? null };
}

export async function getRecentDonations(): Promise<Donation[]> {
  const wordpressApi = (
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1"
  ).replace(/\/$/, "");
  
  const apiKey = process.env.GROWFUND_CLIENT_API_KEY;
  if (!apiKey) {
    console.error("Global donation feed unavailable: API Key missing.");
    return [];
  }

  try {
    // 1. Get System Token
    const tokenResponse = await fetch(`${wordpressApi}/auth/system-token`, {
      method: "POST",
      headers: { Accept: "application/json", "X-API-Key": apiKey },
      cache: "no-store",
    });
    const tokenData = await tokenResponse.json().catch(() => null);
    const token = tokenData?.system_access_token;
    
    if (!token) {
      console.error("Failed to fetch system token for donations.");
      return [];
    }

    // 2. Fetch the paginated recent donations with your required parameters
    const url = `${wordpressApi}/donations/recent?page=1&per_page=50&fund_id=1&orderby=created_at&order=DESC`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Donations endpoint returned an error:", response.status);
      return [];
    }

    const payload = await response.json().catch(() => null);
    
    // 3. Deep extraction to handle various WordPress REST API structures
    let rawDonations: any[] = [];
    if (Array.isArray(payload)) {
      rawDonations = payload;
    } else if (Array.isArray(payload?.data)) {
      rawDonations = payload.data;
    } else if (Array.isArray(payload?.data?.results)) {
      rawDonations = payload.data.results;
    } else if (Array.isArray(payload?.paginated?.results)) {
      rawDonations = payload.paginated.results;
    }

    // Map the array using the robust extraction from campaigns.ts
    return rawDonations.map((item: any, index: number) => {
      const isAnonymous = Boolean(item?.is_anonymous ?? item?.anonymous ?? item?.hide_name);
      const person = item?.donor ?? item?.contributor ?? item?.user ?? null;
      
      const donorName = isAnonymous
        ? "Anonymous"
        : String(
            item?.donor_name ??
            item?.contributor_name ??
            item?.name ??
            person?.display_name ??
            [person?.first_name, person?.last_name].filter(Boolean).join(" ") ??
            "Anonymous"
          ).trim() || "Anonymous";

      return {
        id: String(item?.id ?? index),
        donor_name: donorName,
        amount: Number(item?.amount ?? 0) || 0,
        currency: String(item?.currency ?? "USD").toUpperCase(),
        created_at: item?.created_at ?? item?.date ?? null,
        is_anonymous: isAnonymous,
      };
    });

  } catch (error) {
    console.error("Failed to fetch global recent donations:", error);
    return [];
  }
}
