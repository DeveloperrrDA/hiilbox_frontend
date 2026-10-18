import { NextRequest, NextResponse } from "next/server";
import { wcAuthHeader, wcUrl, gfcmHeaders, gfcmUrl, systemToken } from "../_server";
import { loadCheckoutCurrencies } from "../_currency";

type Rate = { gateway: string | number; platform: string | number };
type RateResponse = { success?: boolean; data?: Record<string, Rate> };

const cents = (value: number) => Math.round((value + Number.EPSILON) * 100);
const money = (valueInCents: number) => (valueInCents / 100).toFixed(2);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const originalAmount = Number(body.amount);
    const originalTip = Number(body.tip_amount ?? 0);
    const originalCurrency = String(body.currency || "USD").trim().toUpperCase();
    const campaignId = Number(body.campaign_id);
    const paymentMethod = String(body.payment_method || "").trim();

    if (
      !Number.isSafeInteger(campaignId) || campaignId <= 0 ||
      !Number.isFinite(originalAmount) || originalAmount <= 0 ||
      !Number.isFinite(originalTip) || originalTip < 0 ||
      !paymentMethod
    ) {
      return NextResponse.json({ message: "Valid campaign, amount and payment method are required." }, { status: 400 });
    }

    const currencies = await loadCheckoutCurrencies();
    const selectedCurrency = currencies.find((currency) => currency.code === originalCurrency);
    if (!selectedCurrency || !Number.isFinite(selectedCurrency.rate) || selectedCurrency.rate <= 0) {
      return NextResponse.json({ message: `Currency ${originalCurrency} is not configured for checkout.` }, { status: 400 });
    }

    // The donor-entered amount is the FULL charge, including the tip and fees.
    const usdTotal = originalCurrency === "USD" ? originalAmount : originalAmount / selectedCurrency.rate;
    const usdTip = originalCurrency === "USD" ? originalTip : originalTip / selectedCurrency.rate;
    if (!Number.isFinite(usdTotal) || !Number.isFinite(usdTip)) {
      return NextResponse.json({ message: "Unable to convert donation to USD." }, { status: 400 });
    }
    const totalCents = cents(usdTotal);
    const tipCents = cents(usdTip);
    if (totalCents < 1 || tipCents < 0) {
      return NextResponse.json({ message: "Donation amount must be at least $0.01 USD." }, { status: 400 });
    }

    // Retrieve fee rates on the server; never trust fee rates sent by the browser.
    const token = await systemToken();
    const ratesResponse = await fetch(gfcmUrl("/platform-rates"), {
      headers: gfcmHeaders(token),
      cache: "no-store",
    });
    if (!ratesResponse.ok) {
      return NextResponse.json({ message: "Could not verify current processing fees. Please try again." }, { status: 503 });
    }
    const ratesPayload = (await ratesResponse.json()) as RateResponse;
    const rate = ratesPayload?.data?.[paymentMethod];
    if (ratesPayload?.success !== true || !rate) {
      return NextResponse.json({ message: "Processing fees are not configured for this payment method." }, { status: 400 });
    }
    const gatewayRate = Number(rate.gateway);
    const platformRate = Number(rate.platform);
    if (
      !Number.isFinite(gatewayRate) || gatewayRate < 0 || gatewayRate > 100 ||
      !Number.isFinite(platformRate) || platformRate < 0 || platformRate > 100
    ) {
      return NextResponse.json({ message: "Invalid payment processing fee configuration." }, { status: 503 });
    }

    // Round the combined processing fee once, then split it into two exact cent amounts.
    const feeCents = Math.round(totalCents * (gatewayRate + platformRate) / 100);
    const gatewayFeeCents = Math.round(totalCents * gatewayRate / 100);
    const platformFeeCents = feeCents - gatewayFeeCents;
    const netCents = totalCents - tipCents - feeCents;
    if (netCents < 1) {
      return NextResponse.json({ message: "Donation must exceed the tip and processing fees." }, { status: 400 });
    }

    const donationProductId = Number(process.env.GROWFUND_DONATION_PRODUCT_ID || 661);
    const tipProductId = Number(process.env.GROWFUND_TIP_PRODUCT_ID || 0);
    if (!Number.isSafeInteger(donationProductId) || donationProductId <= 0) {
      return NextResponse.json({ message: "Donation product is not configured." }, { status: 503 });
    }

    // The sum of all WooCommerce lines MUST equal totalCents.
    // Fee lines are allocations within the donor's payment, NOT extra charges.
    const line_items: Array<Record<string, unknown>> = [
      {
        product_id: donationProductId,
        quantity: 1,
        subtotal: money(netCents),
        total: money(netCents),
        meta_data: [{ key: "_is_gfcm_donation_product", value: "yes" }],
      },
    ];
    const fee_lines: Array<Record<string, unknown>> = [];

    if (tipCents > 0) {
      if (tipProductId > 0) {
        line_items.push({
          product_id: tipProductId,
          quantity: 1,
          subtotal: money(tipCents),
          total: money(tipCents),
        });
      } else {
        fee_lines.push({ name: "HiilBox Tip (included)", total: money(tipCents), tax_status: "none" });
      }
    }
    if (gatewayFeeCents > 0) {
      fee_lines.push({ name: "Payment Processing Fee (included)", total: money(gatewayFeeCents), tax_status: "none" });
    }
    if (platformFeeCents > 0) {
      fee_lines.push({ name: "Platform Fee (included)", total: money(platformFeeCents), tax_status: "none" });
    }

    const payload = {
      customer_id: Number(body.user_id || 0),
      payment_method: paymentMethod,
      set_paid: false,
      currency: "USD",
      billing: {
        first_name: String(body.first_name || ""),
        last_name: String(body.last_name || ""),
        email: String(body.email || ""),
        phone: String(body.phone || ""),
        address_1: String(body.address || ""),
        address_2: String(body.address_2 || ""),
        city: String(body.city || ""),
        state: String(body.state || ""),
        postcode: String(body.zip_code || ""),
        country: String(body.country || ""),
      },
      line_items,
      fee_lines,
      meta_data: [
        { key: "_fude_custom_campaign_id", value: campaignId },
        { key: "custom_fude_campaign_id", value: campaignId },
        { key: "_growfund_tip_amount", value: money(tipCents) },
        { key: "_gfcm_original_currency", value: originalCurrency },
        { key: "_gfcm_original_amount", value: originalAmount.toFixed(2) },
        { key: "_gfcm_original_donation_amount", value: originalAmount.toFixed(2) },
        { key: "_gfcm_original_tip_amount", value: originalTip.toFixed(2) },
        { key: "_gfcm_exchange_rate", value: selectedCurrency.rate.toString() },
        { key: "_gfcm_usd_donation_amount", value: money(netCents) },
        { key: "_gfcm_usd_tip_amount", value: money(tipCents) },
        { key: "_gfcm_usd_total_paid", value: money(totalCents) },
        { key: "_gfcm_usd_gateway_fee", value: money(gatewayFeeCents) },
        { key: "_gfcm_usd_platform_fee", value: money(platformFeeCents) },
        { key: "_gfcm_usd_net_donation", value: money(netCents) },
        { key: "_gfcm_gateway_fee_percent", value: gatewayRate.toString() },
        { key: "_gfcm_platform_fee_percent", value: platformRate.toString() },
        { key: "growfund_is_anonymous", value: body.is_anonymous ? "1" : "0" },
        { key: "_growfund_donation_service", value: "growfund" },
      ],
    };

    const response = await fetch(wcUrl("/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: wcAuthHeader() },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message ?? "WooCommerce could not create the order.", details: data },
        { status: response.status }
      );
    }

    // Prevent charging an unexpected amount if WooCommerce adds taxes, gateway surcharges,
    // or another plugin changes the order total. This order may still need cleanup.
    const actualTotalCents = cents(Number(data?.total));
    if (!Number.isFinite(actualTotalCents) || actualTotalCents !== totalCents) {
      return NextResponse.json(
        {
          message: "Order total does not match the donor-approved amount. Payment was not started.",
          order_id: data?.id ?? null,
          expected_total: money(totalCents),
          actual_total: data?.total ?? null,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ id: data.id, order_key: data.order_key }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Order creation failed." },
      { status: 500 }
    );
  }
}
