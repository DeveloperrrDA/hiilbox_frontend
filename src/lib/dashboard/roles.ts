export type DashboardRole = "admin" | "fundraiser" | "donor" | "guest";

function roleStrings(user: any): string[] {
  const candidates: any[] = [];
  const push = (value: any) => {
    if (Array.isArray(value)) value.forEach(push);
    else if (value !== undefined && value !== null && value !== "") candidates.push(value);
  };
  push(user?.roles);
  push(user?.role);
  push(user?.user_role);
  push(user?.user_roles);
  push(user?.user_type);
  push(user?.type);
  push(user?.data?.roles);
  push(user?.data?.role);
  push(user?.data?.user_type);
  return candidates.map((r) => String(r).toLowerCase().trim()).filter(Boolean);
}

export function dashboardRole(user: any): DashboardRole {
  const roles = roleStrings(user);
  if (roles.some((r) => ["administrator", "admin", "shop_manager"].includes(r) || r.includes("administrator"))) return "admin";
  if (roles.some((r) => r.includes("fundraiser"))) return "fundraiser";
  if (roles.some((r) => r.includes("donor") || r.includes("customer") || r.includes("subscriber"))) return "donor";
  return "guest";
}

export function savedDashboardUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("auth_user") || "null"); } catch { return null; }
}
