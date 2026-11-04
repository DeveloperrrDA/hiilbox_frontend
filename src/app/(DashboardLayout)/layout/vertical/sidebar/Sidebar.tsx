"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import { Separator } from "@/components/ui/separator";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";
import FullLogo from "../../shared/logo/FullLogo";
import Logo from "../../shared/logo/Logo";
import SideProfile from "./SideProfile/SideProfile";

const SidebarLayout = () => {
  const { isCollapse } = useContext(CustomizerContext);
  const [role, setRole] = useState<"admin" | "fundraiser" | "donor" | "guest">("guest");

  useEffect(() => {
    const syncRole = () => setRole(dashboardRole(savedDashboardUser()));
    syncRole();
    window.addEventListener("storage", syncRole);
    window.addEventListener("hiilbox-auth-changed", syncRole as EventListener);
    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("hiilbox-auth-changed", syncRole as EventListener);
    };
  }, []);

  const roleContent = useMemo(() => {
    const clone: any[] = JSON.parse(JSON.stringify(SidebarContent));
    const dashboard = clone.find((x) => x.id === 1);
    const section = dashboard?.items?.find((x: any) => x.heading === "Dashboards");
    
    if (section) {
      const byName = new Map((section.children || []).map((x: any) => [x.name, x]));
      if (role === "admin") {
        section.children = [
          { ...(byName.get("Overview") || {}), name: "Home" },
          byName.get("Campaigns"), byName.get("Donations"), byName.get("Withdrawals"),
          byName.get("Donors"), byName.get("Fundraisers"), byName.get("Users"),
          byName.get("KYC"), byName.get("Analytics"),
        ].filter(Boolean);
      } else if (role === "fundraiser") {
        section.children = [
          { ...(byName.get("Overview") || {}), name: "Home" },
          { ...(byName.get("Campaigns") || {}), name: "My Campaigns" },
          byName.get("Donations"),
          byName.get("Donors"),
          { name: "My Donations", icon: "solar:hand-money-line-duotone", id: "my-giving", url: "/dashboard/my-giving" },
          { ...(byName.get("Analytics") || {}), url: "/dashboard/analytics" },
          { name: "Wallet", icon: "solar:wallet-money-line-duotone", id: "fundraiser-wallet", url: "/dashboard/fundraiser-wallet" },
          { name: "Bookmarks", icon: "solar:bookmark-line-duotone", id: "bookmarks", url: "/dashboard/bookmarks" },
          { name: "Profile", icon: "solar:user-circle-line-duotone", id: "profile", url: "/dashboard/profile" },
          { name: "Settings", icon: "solar:settings-line-duotone", id: "settings", url: "/dashboard/settings" },
        ].filter(Boolean);
      } else if (role === "donor") {
        section.children = [
          { ...(byName.get("Overview") || {}), name: "Home" },
          { name: "My Donations", icon: "solar:hand-money-line-duotone", id: "donor-donations", url: "/dashboard/my-donations" },
          { name: "Bookmarks", icon: "solar:bookmark-line-duotone", id: "bookmarks", url: "/dashboard/bookmarks" },
          { name: "Profile", icon: "solar:user-circle-line-duotone", id: "profile", url: "/dashboard/profile" },
          { name: "Settings", icon: "solar:settings-line-duotone", id: "settings", url: "/dashboard/settings" },
        ].filter(Boolean);
      } else {
        section.children = [byName.get("Home"), byName.get("Overview")].filter(Boolean);
      }
      if (role !== "admin") dashboard.items = [section];
    }
    
    // Flatten menu items for a seamless single sidebar
    return role === "admin" ? clone.flatMap((x) => x.items) : (dashboard?.items || []);
  }, [role]);

  const isMini = isCollapse === "mini-sidebar";

  return (
    <aside
      className={`fixed start-0 top-0 h-full bg-white dark:bg-darkgray border-e border-ld z-[50] flex flex-col transition-all duration-300 ease-in-out ${
        isMini ? "w-[80px]" : "w-[260px]"
      }`}
    >
      {/* Dynamic Logo Section */}
      <div className={`flex h-[80px] shrink-0 items-center border-b border-transparent transition-all ${isMini ? "justify-center px-0" : "px-6"}`}>
        {isMini ? <Logo /> : <FullLogo />}
      </div>

      {/* Scrollable Content - Native Scrollbar (No SimpleBar) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className={`py-4 ${isMini ? "px-2" : "px-4"}`}>
          {roleContent.map((item: any, index: number) => (
            <div className="mb-4" key={item.heading || index}>
              {!isMini && item.heading && (
                <h5 className="text-link dark:text-white font-semibold text-sm mb-2 truncate px-2">
                  {item.heading}
                </h5>
              )}
              {item.children?.map((child: any, idx: number) => (
                <React.Fragment key={child.id || idx}>
                  {child.children ? (
                    <NavCollapse item={child} isMini={isMini} />
                  ) : (
                    <NavItems item={child} isMini={isMini} />
                  )}
                </React.Fragment>
              ))}
              {index < roleContent.length - 1 && !isMini && (
                <Separator className="my-4 border-b border-dashed border-border dark:border-darkborder" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Profile Area */}
      <div className={`py-4 flex shrink-0 items-center border-t border-ld transition-all ${isMini ? "justify-center px-2" : "px-4"}`}>
        <SideProfile isMini={isMini} />
      </div>
    </aside>
  );
};

export default SidebarLayout;