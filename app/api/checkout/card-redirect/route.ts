import { NextRequest, NextResponse } from "next/server";
import { wcAuthHeader, wcUrl } from "../_server";

export async function GET(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("order_id"));
  const key = request.nextUrl.searchParams.get("key") ?? "";
  if (!Number.isSafeInteger(id) || id <= 0 || !key) {
    return NextResponse.json({ message: "Invalid payment reference." }, { status: 400 });
  }
  try {
    const response = await fetch(wcUrl(`/orders/${id}`), {
      headers: { Authorization: wcAuthHeader(), Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ message: "Order could not be verified." }, { status: 502 });
    const order = await response.json();
    if (order.order_key !== key || !/shalo|sifalo|card_pay/i.test(String(order.payment_method ?? ""))) {
      return NextResponse.json({ message: "Payment reference does not match a card order." }, { status: 403 });
    }
    if (!["pending", "failed"].includes(String(order.status))) {
      return NextResponse.json({ message: "Order is not awaiting payment." }, { status: 409 });
    }
    const wordpress = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.hiilbox.com").replace(/\/$/, "");
    const url = new URL(`/checkout/order-pay/${id}/`, wordpress);
    url.searchParams.set("pay_for_order", "true");
    url.searchParams.set("key", key);
    return NextResponse.redirect(url, 303);
  } catch {
    return NextResponse.json({ message: "Unable to open secure payment page." }, { status: 502 });
  }
}
