import { NextRequest, NextResponse } from "next/server";
import { wcAuthHeader, wcUrl } from "../../_server";
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const key = request.nextUrl.searchParams.get("key");
    if (!key) return NextResponse.json({ message: "Order key is required." }, { status: 401 });
    const response = await fetch(wcUrl(`/orders/${encodeURIComponent(id)}`), { headers: { Accept: "application/json", Authorization: wcAuthHeader() }, cache: "no-store" });
    const order = await response.json().catch(() => null);
    if (!response.ok) return NextResponse.json({ message: order?.message ?? "Order not found." }, { status: response.status });
    if (!order?.order_key || order.order_key !== key) return NextResponse.json({ message: "Invalid order key." }, { status: 403 });
    const meta = new Map<string, unknown>(
      Array.isArray(order.meta_data)
        ? order.meta_data.map((item: any) => [String(item?.key || ""), item?.value])
        : []
    );
    return NextResponse.json({
      order_id: order.id,
      donation_id: Number(
        meta.get("_growfund_donation_id") ??
        meta.get("growfund_donation_id") ??
        meta.get("_gfcm_donation_id") ??
        0
      ) || null,
      transaction_id: order.transaction_id || null,
      payment_method: order.payment_method_title || order.payment_method,
      status: order.status,
      payment_status: ["processing", "completed"].includes(order.status)
        ? "paid"
        : order.status === "failed"
          ? "failed"
          : order.status === "refunded"
            ? "refunded"
            : "pending",
      total: String(meta.get("_gfcm_original_amount") ?? order.total ?? ""),
      currency: String(meta.get("_gfcm_original_currency") ?? order.currency ?? "USD"),
      donation_amount: String(meta.get("_gfcm_original_donation_amount") ?? order.total ?? ""),
      tip_amount: String(meta.get("_gfcm_original_tip_amount") ?? "0"),
      campaign_id: Number(meta.get("_fude_custom_campaign_id") ?? meta.get("custom_fude_campaign_id") ?? 0) || null,
      donor_name: `${order?.billing?.first_name || ""} ${order?.billing?.last_name || ""}`.trim() || "Anonymous",
      date_created: order.date_created || null,
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load order." }, { status: 500 });
  }
}
