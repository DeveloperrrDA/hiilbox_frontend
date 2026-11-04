
export const MOBILE_PROVIDERS = {
  "061": "EVC Plus",
  "077": "EVC Plus",
  "062": "eDahab",
  "063": "ZAAD",
  "064": "Somlink",
  "065": "eDahab",
  "066": "eDahab",
  "067": "Somtelco",
  "068": "Jeeb",
  "069": "NationLink",
  "090": "Sahal",
  "071": "Amtel",
} as const;

export function detectMobileProvider(phone: string) {
  let normalized = phone.replace(/[^\d]/g, "");

  // Convert +25263... or 25263... to 063...
  if (normalized.startsWith("252")) {
    normalized = "0" + normalized.slice(3);
  }

  // Accept 63... as 063...
  if (!normalized.startsWith("0")) {
    normalized = "0" + normalized;
  }

  const prefix = normalized.slice(0, 3);
  const provider =
    MOBILE_PROVIDERS[prefix as keyof typeof MOBILE_PROVIDERS];

  if (!provider) return null;

  return {
    prefix,
    provider,
    phone: normalized,
    supported: prefix !== "069",
  };
}
