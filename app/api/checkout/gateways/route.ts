import { NextResponse } from "next/server";
import { gfcmCheckoutUrl } from "../_server";
export async function GET() {
  try {
    const response = await fetch(gfcmCheckoutUrl("/checkout-gateways"), { headers: { Accept: "application/json" }, cache: "no-store" });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data ?? { gateways: [] }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load gateways." }, { status: 500 });
  }
}
