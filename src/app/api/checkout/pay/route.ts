import { NextRequest, NextResponse } from "next/server";
import { gfcmHeaders, gfcmUrl, systemToken } from "../_server";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = Number(body.order_id);
    if (!orderId) return NextResponse.json({ message: "order_id is required." }, { status: 400 });
    const token = await systemToken();
    const response = await fetch(gfcmUrl(`/orders/${orderId}/pay`), {
      method: "POST", headers: gfcmHeaders(token), body: JSON.stringify({ account: String(body.account || "") }), cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return NextResponse.json({ message: data?.message ?? "Payment failed.", details: data }, { status: response.status });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Payment failed." }, { status: 500 });
  }
}
