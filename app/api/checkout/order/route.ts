import { NextRequest, NextResponse } from "next/server";
import { wcAuthHeader, wcUrl } from "../_server";
import { loadCheckoutCurrencies } from "../_currency";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const originalAmount = Number(body.amount);
    const originalTip = Number(body.tip_amount ?? 0);
    const originalCurrency = String(body.currency || "USD").trim().toUpperCase();
    if (!body.campaign_id || !Number.isFinite(originalAmount) || originalAmount <= 0 || !Number.isFinite(originalTip) || originalTip < 0 || !body.payment_method) {
      return NextResponse.json({ message: "Campaign, amount and payment method are required." }, { status: 400 });
    }

    const currencies = await loadCheckoutCurrencies();
    const selectedCurrency = currencies.find((currency) => currency.code === originalCurrency);
    if (!selectedCurrency) {
      return NextResponse.json({ message: `Currency ${originalCurrency} is not configured for checkout.` }, { status: 400 });
    }

    // Rates are configured as local units per 1 USD (for example 1 USD = 8500 SLSH).
    // WooCommerce and GrowFund remain USD-based; the donor's entered values are preserved as metadata.
    const amount = originalCurrency === "USD" ? originalAmount : originalAmount / selectedCurrency.rate;
    const tip = originalCurrency === "USD" ? originalTip : originalTip / selectedCurrency.rate;
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(tip) || tip < 0) {
      return NextResponse.json({ message: "Unable to convert the donation to USD." }, { status: 400 });
    }

    const donationProductId = Number(process.env.GROWFUND_DONATION_PRODUCT_ID || 661);
    const tipProductId = Number(process.env.GROWFUND_TIP_PRODUCT_ID || 0);
    const line_items: Array<Record<string, unknown>> = [
      { product_id: donationProductId, quantity: 1, subtotal: amount.toFixed(2), total: amount.toFixed(2), meta_data: [{ key: "_is_gfcm_donation_product", value: "yes" }] },
    ];
    if (tip > 0 && tipProductId > 0) {
      line_items.push({ product_id: tipProductId, quantity: 1, subtotal: tip.toFixed(2), total: tip.toFixed(2) });
    }

    const payload = {
      customer_id: Number(body.user_id || 0),
      payment_method: String(body.payment_method),
      set_paid: false,
      currency: "USD",
      billing: {
        first_name: String(body.first_name || ""), last_name: String(body.last_name || ""), email: String(body.email || ""),
        phone: String(body.phone || ""), address_1: String(body.address || ""), address_2: String(body.address_2 || ""),
        city: String(body.city || ""), state: String(body.state || ""), postcode: String(body.zip_code || ""), country: String(body.country || ""),
      },
      line_items,
      ...(tip > 0 && !tipProductId ? { fee_lines: [{ name: "Growfund Tip", total: tip.toFixed(2), tax_status: "none" }] } : {}),
      meta_data: [
        { key: "_fude_custom_campaign_id", value: Number(body.campaign_id) },
        { key: "custom_fude_campaign_id", value: Number(body.campaign_id) },
        { key: "_growfund_tip_amount", value: tip.toFixed(2) },
        { key: "_gfcm_original_currency", value: originalCurrency },
        { key: "_gfcm_original_amount", value: (originalAmount + originalTip).toFixed(2) },
        { key: "_gfcm_original_donation_amount", value: originalAmount.toFixed(2) },
        { key: "_gfcm_original_tip_amount", value: originalTip.toFixed(2) },
        { key: "_gfcm_exchange_rate", value: selectedCurrency.rate.toString() },
        { key: "_gfcm_usd_donation_amount", value: amount.toFixed(2) },
        { key: "_gfcm_usd_tip_amount", value: tip.toFixed(2) },
        { key: "growfund_is_anonymous", value: body.is_anonymous ? "1" : "0" },
        { key: "_growfund_donation_service", value: "growfund" },
      ],
    };

    const response = await fetch(wcUrl("/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: wcAuthHeader() },
      body: JSON.stringify(payload), cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return NextResponse.json({ message: data?.message ?? "WooCommerce could not create the order.", details: data }, { status: response.status });
    return NextResponse.json({ id: data.id, order_key: data.order_key }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Order creation failed." }, { status: 500 });
  }
}
