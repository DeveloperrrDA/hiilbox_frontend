export function adminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    ""
  );
}

export async function adminApi(path: string, init: RequestInit = {}) {
  const token = adminToken();
  if (!token) throw new Error("Please sign in to use the admin dashboard.");

  const response = await fetch(`/api/admin/growfund/${path.replace(/^\//, "")}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data?.message ||
      data?.data?.message ||
      data?.error ||
      `Request failed (${response.status}).`;
    throw new Error(message);
  }
  return data;
}

function firstArray(value: any, depth = 0): any[] | null {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object" || depth > 4) return null;

  const preferred = [
    "data",
    "items",
    "results",
    "rows",
    "records",
    "donations",
    "donors",
    "fundraisers",
    "campaigns",
  ];

  for (const key of preferred) {
    if (key in value) {
      const found = firstArray(value[key], depth + 1);
      if (found) return found;
    }
  }

  for (const child of Object.values(value)) {
    const found = firstArray(child, depth + 1);
    if (found) return found;
  }
  return null;
}

export function rowsFrom(data: any): any[] {
  return firstArray(data) || [];
}

export function dataFrom(data: any): any {
  return data?.data?.data ?? data?.data ?? data ?? {};
}

export function idOf(row: any) {
  return Number(
    row?.id ??
      row?.ID ??
      row?.donation_id ??
      row?.donor_id ??
      row?.fundraiser_id ??
      row?.user_id ??
      row?.user?.id ??
      0,
  );
}

export function nameOf(row: any) {
  const combined = [row?.first_name, row?.last_name].filter(Boolean).join(" ");
  return String(
    row?.display_name ??
      row?.name ??
      row?.full_name ??
      row?.user?.display_name ??
      combined ??
      row?.username ??
      row?.user_login ??
      "",
  ).trim();
}

export function fmtDate(value: any) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
}

export function money(value: any, currency = "$") {
  const n = Number(value ?? 0);
  return `${currency || "$"}${Number.isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}`;
}
