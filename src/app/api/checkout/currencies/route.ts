import { NextResponse } from "next/server";
import { loadCheckoutCurrencies } from "../_currency";

export async function GET() {
  try {
    return NextResponse.json({ currencies: await loadCheckoutCurrencies() });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load currencies." },
      { status: 500 }
    );
  }
}
