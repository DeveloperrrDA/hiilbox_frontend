"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { dashboardRole, savedDashboardUser, type DashboardRole } from "@/lib/dashboard/roles";
import FundraiserKycNotice from "./FundraiserKycNotice";

export default function DashboardAccessGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<DashboardRole>("guest");

  useEffect(() => {
    let cancelled = false;
    async function resolveUser() {
      setReady(false);
      const token = localStorage.getItem("access_token") || "";
      if (!token) { router.replace(`/login?next=${encodeURIComponent(pathname)}`); return; }

      let saved = savedDashboardUser();
      let resolvedRole = dashboardRole(saved);
      try {
        const response = await fetch("/api/dashboard/me", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        const json = await response.json().catch(() => null);
        if (response.ok && json?.data) {
          saved = { ...(saved || {}), ...json.data, roles: json.data.roles?.length ? json.data.roles : saved?.roles };
          localStorage.setItem("auth_user", JSON.stringify(saved));
          resolvedRole = dashboardRole(saved);
          window.dispatchEvent(new Event("hiilbox-auth-changed"));
        }
      } catch { /* use the saved login payload */ }
      if (cancelled) return;
      setRole(resolvedRole);

      const adminOnly = ["/dashboard/fundraisers", "/dashboard/withdrawals"];
      const fundraiserOnly = ["/dashboard/fundraiser-wallet", "/dashboard/campaigns", "/dashboard/donations", "/dashboard/donors", "/dashboard/analytics", "/dashboard/my-giving"];
      const donorOnly = ["/dashboard/my-donations"];
      if (adminOnly.some((p) => pathname.startsWith(p)) && resolvedRole !== "admin") { router.replace("/dashboard"); return; }
      if (fundraiserOnly.some((p) => pathname.startsWith(p)) && !["fundraiser", "admin"].includes(resolvedRole)) { router.replace("/dashboard"); return; }
      if (donorOnly.some((p) => pathname.startsWith(p)) && !["donor", "admin"].includes(resolvedRole)) { router.replace("/dashboard"); return; }
      setReady(true);
    }
    void resolveUser();
    return () => { cancelled = true; };
  }, [pathname, router]);

  if (!ready) return <div className="py-12 text-center text-sm text-darklink">Loading dashboard…</div>;
  return <>{children}{role === "fundraiser" && <FundraiserKycNotice />}</>;
}
