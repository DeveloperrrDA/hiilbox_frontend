import { gfcmHeaders, gfcmUrl, systemToken } from "./_server";

export interface CheckoutCurrency {
  code: string;
  name: string;
  rate: number;
}

const ALLOWED = ["USD", "ETB", "KES", "SLSH", "SOS"] as const;
const ALLOWED_SET = new Set<string>(ALLOWED);
const NAMES: Record<string, string> = {
  USD: "US Dollar",
  ETB: "Ethiopian Birr (eBirr)",
  KES: "Kenyan Shilling",
  SLSH: "Somaliland Shilling",
  SOS: "Somali Shilling",
};

function numericRate(value: any): number {
  const candidates = [
    value?.rate,
    value?.exchange_rate,
    value?.conversion_rate,
    value?.value,
    value?.usd_rate,
    typeof value === "number" || typeof value === "string" ? value : undefined,
  ];
  for (const candidate of candidates) {
    const rate = Number(candidate);
    if (Number.isFinite(rate) && rate > 0) return rate;
  }
  return NaN;
}

function normalizeCurrencyRows(raw: unknown): CheckoutCurrency[] {
  const found = new Map<string, CheckoutCurrency>();

  const add = (codeValue: unknown, value: any) => {
    const code = String(
      codeValue ?? value?.code ?? value?.currency_code ?? value?.currency ?? value?.iso_code ?? ""
    ).trim().toUpperCase();
    if (!ALLOWED_SET.has(code)) return;
    const rate = code === "USD" ? 1 : numericRate(value);
    if (!Number.isFinite(rate) || rate <= 0) return;
    found.set(code, {
      code,
      name: String(value?.name ?? value?.currency_name ?? value?.label ?? NAMES[code]),
      rate,
    });
  };

  const walk = (value: any, hintedCode?: string, depth = 0) => {
    if (depth > 6 || value == null) return;
    if (hintedCode && ALLOWED_SET.has(hintedCode.toUpperCase())) add(hintedCode, value);
    if (Array.isArray(value)) {
      for (const item of value) {
        add(item?.code ?? item?.currency_code ?? item?.currency ?? item?.iso_code, item);
        walk(item, undefined, depth + 1);
      }
      return;
    }
    if (typeof value === "object") {
      add(value?.code ?? value?.currency_code ?? value?.currency ?? value?.iso_code, value);
      for (const [key, child] of Object.entries(value)) {
        walk(child, key, depth + 1);
      }
    }
  };

  walk(raw);
  found.set("USD", { code: "USD", name: NAMES.USD, rate: 1 });

  // Optional server-side fallbacks. These are useful when an older GrowFund
  // currencies endpoint omits a configured currency, without exposing rates
  // to the browser as trusted input.
  for (const code of ALLOWED) {
    if (code === "USD" || found.has(code)) continue;
    const envRate = Number(process.env[`GROWFUND_RATE_${code}`]);
    if (Number.isFinite(envRate) && envRate > 0) {
      found.set(code, { code, name: NAMES[code], rate: envRate });
    }
  }

  return ALLOWED.flatMap((code) => (found.has(code) ? [found.get(code)!] : []));
}

export async function loadCheckoutCurrencies(): Promise<CheckoutCurrency[]> {
  const token = await systemToken();
  const response = await fetch(gfcmUrl("/currencies"), {
    headers: gfcmHeaders(token),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "Unable to load currencies.");
  return normalizeCurrencyRows(data);
}
