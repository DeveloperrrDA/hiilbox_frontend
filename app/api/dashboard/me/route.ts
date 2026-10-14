import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../campaigns/_server";

function list(value: any): string[] {
  if (Array.isArray(value)) return value.flatMap(list);
  if (value === undefined || value === null || value === "") return [];
  return [String(value)];
}
function firstMeta(meta: any, key: string) {
  const value = meta?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;

  const top = auth.user ?? {};
  const meta = top?.data && typeof top.data === "object" ? top.data : {};
  const roles = [
    ...list(top?.roles), ...list(top?.user_roles), ...list(top?.role), ...list(top?.user_role), ...list(top?.user_type),
    ...list(meta?.roles), ...list(meta?.user_roles), ...list(meta?.role), ...list(meta?.user_role), ...list(meta?.user_type),
  ];
  const capabilityText = JSON.stringify(meta?.wp_capabilities ?? meta?.capabilities ?? "").toLowerCase();
  for (const role of ["administrator", "shop_manager", "growfund_fundraiser", "growfund_donor"]) {
    if (capabilityText.includes(role)) roles.push(role);
  }
  const uniqueRoles = roles.filter((value, index, values) => value && values.indexOf(value) === index);

  return NextResponse.json({
    success: true,
    data: {
      id: Number(top?.user_id ?? top?.id ?? auth.userId),
      username: String(top?.username ?? top?.user_login ?? firstMeta(meta,"nickname") ?? ""),
      email: String(top?.email ?? top?.user_email ?? ""),
      first_name: String(top?.first_name ?? firstMeta(meta,"first_name") ?? ""),
      last_name: String(top?.last_name ?? firstMeta(meta,"last_name") ?? ""),
      display_name: String(top?.display_name ?? top?.name ?? ""),
      avatar_url: String(top?.avatar_url ?? top?.avatar ?? ""),
      roles: uniqueRoles,
      role: String(top?.role ?? top?.user_role ?? firstMeta(meta,"role") ?? ""),
      user_type: String(top?.user_type ?? firstMeta(meta,"user_type") ?? ""),
    },
  });
}
