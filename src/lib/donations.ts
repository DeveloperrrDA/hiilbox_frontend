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
  payment_status: "pending" | "on-hold" | "paid" | "failed" | "refunded" | "cancelled";
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
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data && typeof data === "object" ? data as Record<string, unknown> : {};
    throw new Error(String(error.message ?? error.error ?? error.code ?? "Checkout request failed."));
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
  const raw: unknown[] = Array.isArray(data) ? data : (data && typeof data === "object" && "gateways" in data && Array.isArray(data.gateways) ? data.gateways : []);
  return raw
    .filter((gateway): gateway is Record<string, unknown> => gateway !== null && typeof gateway === "object" && !Array.isArray(gateway))
    .map((gateway) => ({
      id: String(gateway.id ?? ""),
      title: String(gateway.title ?? gateway.method_title ?? gateway.id ?? "Payment"),
      description: gateway.description ? String(gateway.description) : undefined,
      enabled: gateway.enabled !== false,
      requires_account: typeof gateway.requires_account === "boolean" ? gateway.requires_account : ["zes_pay", "edahab_pay", "premier_wallet_pay"].includes(String(gateway.id ?? "")),
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

  // Shalo/Sifalo card payments use WooCommerce's order-pay page, where the
  // installed gateway plugin securely initiates a fresh hosted checkout session.
  // Do not reuse an existing Sifalo token or mark this order as paid.
  if (/shalo|sifalo|card_pay/i.test(input.payment_method)) {
    if (!order.order_key || !Number.isSafeInteger(order.id)) {
      throw new Error("WooCommerce did not return a valid order payment reference.");
    }
    return {
      success: true,
      order_id: order.id,
      order_key: order.order_key,
      transaction_id: null,
      payment_method: input.payment_method,
      status: "pending",
      payment_status: "pending",
      user_id: input.user_id ?? null,
      donation_id: null,
      redirect: `/api/checkout/card-redirect?order_id=${encodeURIComponent(String(order.id))}&key=${encodeURIComponent(order.order_key)}`,
    };
  }

  // WooCommerce offline gateways create an on-hold order, not an immediate charge.
  if (["bacs", "cod"].includes(input.payment_method)) {
    return {
      success: true,
      order_id: order.id,
      order_key: order.order_key,
      transaction_id: null,
      payment_method: input.payment_method,
      status: "on-hold",
      payment_status: "on-hold",
      user_id: input.user_id ?? null,
      donation_id: null,
      redirect: null,
    };
  }

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
  const api = (
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1"
  ).replace(/\/$/, "");

  const apiKey = process.env.GROWFUND_CLIENT_API_KEY;
  if (!apiKey) return [];

  try {
    const tokenResponse = await fetch(`${api}/auth/system-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!tokenResponse.ok) return [];

    const tokenData = await tokenResponse.json();
    const token = tokenData?.system_access_token;
    if (!token) return [];

    const response = await fetch(
      `${api}/donations/recent?page=1&per_page=50&orderby=created_at&order=DESC`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-API-Key": apiKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) return [];

    const payload = await response.json();

    const records = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.results)
          ? payload.data.results
          : Array.isArray(payload?.paginated?.results)
            ? payload.paginated.results
            : [];

    return records.map((item: any, index: number) => ({
      id: item.id ?? index,
      donor_name:
        item.donor_name ??
        item.contributor_name ??
        item.name ??
        "Anonymous",
      is_anonymous: Boolean(item.is_anonymous),
      amount: Number(item.amount ?? 0),
      currency: item.currency ?? "USD",
      created_at: item.created_at ?? item.date ?? null,
    }));
  } catch {
    return [];
  }
}