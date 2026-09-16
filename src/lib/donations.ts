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
