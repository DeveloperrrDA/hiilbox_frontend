export function dashboardToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access_token") || "";
}

export async function dashboardApi(path: string, init: RequestInit = {}) {
  const token = dashboardToken();
  if (!token) throw new Error("Please sign in to use your dashboard.");
  const response = await fetch(`/api/dashboard/growfund/${path.replace(/^\//, "")}`, {
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
  if (!response.ok) throw new Error(data?.message || data?.data?.message || data?.error || `Request failed (${response.status}).`);
  return data;
}

export function dashboardRows(value: any, depth = 0): any[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object" || depth > 5) return [];
  for (const key of ["data","results","items","rows","records","donations","activities","requests","withdrawals","paginated"]) {
    if (key in value) { const found = dashboardRows(value[key], depth + 1); if (found.length || Array.isArray(value[key])) return found; }
  }
  for (const child of Object.values(value)) { const found = dashboardRows(child, depth + 1); if (found.length) return found; }
  return [];
}

export function currentUserId() {
  if (typeof window === "undefined") return 0;
  try {
    const u = JSON.parse(localStorage.getItem("auth_user") || "null");
    return Number(u?.id ?? u?.user_id ?? 0);
  } catch { return 0; }
}
