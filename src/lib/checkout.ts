export interface CheckoutRequest {
  campaign_id: number;
  amount: number;
  tip_amount?: number;

  payment_method: string;
  payment_method_title: string;

  currency?: string;

  user_id?: number;

  first_name?: string;
  last_name?: string;
  email?: string;

  donation_product_id: number;
  tip_product_id?: number;
}

export interface CheckoutResponse {
  success: boolean;

  order: {
    id: number;
    transaction_id: string;
    payment_method: string;
    payment_method_title: string;
    status: string;
    payment_status: string;
    total: string;
    currency: string;
  };

  donation: {
    id: number;
    status?: string;
  };

  checkout_url?: string;
}

export async function createCheckout(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campaign_id: data.campaign_id,
      amount: data.amount,
      tip_amount: data.tip_amount ?? 0,

      payment_method: data.payment_method,
      payment_method_title: data.payment_method_title,

      currency: data.currency ?? "USD",

      ...(data.user_id
        ? { user_id: data.user_id }
        : {}),

      ...(data.first_name
        ? { first_name: data.first_name }
        : {}),

      ...(data.last_name
        ? { last_name: data.last_name }
        : {}),

      ...(data.email
        ? { email: data.email }
        : {}),

      donation_product_id: data.donation_product_id,

      ...(data.tip_product_id
        ? { tip_product_id: data.tip_product_id }
        : {}),
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ??
        result?.error ??
        "Unable to complete checkout. Please try again."
    );
  }

  if (!result?.success) {
    throw new Error(
      result?.message ??
        "Checkout could not be completed."
    );
  }

  return result;
}