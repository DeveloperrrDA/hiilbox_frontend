
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  dashboardRole,
  type DashboardRole,
} from "@/lib/dashboard/roles";
import FundraiserKycNotice from "./FundraiserKycNotice";

export default function DashboardAccessGuard({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [access, setAccess] = useState<{
    pathname: string;
    role: DashboardRole;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveUser() {
      setAccess(null);

      const loginUrl = `/login?next=${encodeURIComponent(pathname)}`;

      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace(loginUrl);
        return;
      }

      try {
        const response = await fetch("/api/dashboard/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("auth_user");
            router.replace(loginUrl);
          }
          return;
        }

        const json: unknown = await response.json();

        if (
          !json ||
          typeof json !== "object" ||
          !("data" in json) ||
          !json.data ||
          typeof json.data !== "object"
        ) {
          throw new Error("Invalid authentication response");
        }

        if (cancelled) return;

        const user = json.data;
        const resolvedRole = dashboardRole(user);

        if (resolvedRole === "guest") {
          router.replace(loginUrl);
          return;
        }

        const adminOnly = [
          "/dashboard/fundraisers",
          "/dashboard/withdrawals",
        ];

        const fundraiserOnly = [
          "/dashboard/fundraiser-wallet",
          "/dashboard/campaigns",
          "/dashboard/donations",
          "/dashboard/donors",
          "/dashboard/analytics",
          "/dashboard/my-giving",
        ];

        const donorOnly = [
          "/dashboard/my-donations",
        ];

        const matchesRoute = (route: string) =>
          pathname === route || pathname.startsWith(`${route}/`);

        if (
          adminOnly.some(matchesRoute) &&
          resolvedRole !== "admin"
        ) {
          router.replace("/dashboard");
          return;
        }

        if (
          fundraiserOnly.some(matchesRoute) &&
          !["fundraiser", "admin"].includes(resolvedRole)
        ) {
          router.replace("/dashboard");
          return;
        }

        if (
          donorOnly.some(matchesRoute) &&
          !["donor", "admin"].includes(resolvedRole)
        ) {
          router.replace("/dashboard");
          return;
        }

        localStorage.setItem("auth_user", JSON.stringify(user));

        window.dispatchEvent(new Event("hiilbox-auth-changed"));

        setAccess({
          pathname,
          role: resolvedRole,
        });
      } catch {
        if (!cancelled) {
          router.replace(loginUrl);
        }
      }
    }

    void resolveUser();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!access || access.pathname !== pathname) {
    return (
      <div className="py-12 text-center text-sm text-darklink">
        Checking access…
      </div>
    );
  }

  return (
    <>
      {children}
      {access.role === "fundraiser" && <FundraiserKycNotice />}
    </>
  );
}
