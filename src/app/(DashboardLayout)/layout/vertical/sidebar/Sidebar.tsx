"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";

import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";

import { CustomizerContext } from "@/app/context/CustomizerContext";
import { useRouter } from "next/navigation";

import { IconSidebar } from "./IconSidebar";
import SideProfile from "./SideProfile/SideProfile";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import SimpleBar from "simplebar-react";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";

const SidebarLayout = () => {
  const { isCollapse, activeDir, selectedIconId, setSelectedIconId } =
    useContext(CustomizerContext);

  const [role, setRole] = useState<"admin" | "fundraiser" | "donor" | "guest">("guest");

  useEffect(() => {
    const syncRole = () => setRole(dashboardRole(savedDashboardUser()));
    syncRole();
    window.addEventListener("storage", syncRole);
    window.addEventListener("hiilbox-auth-changed", syncRole as EventListener);
    return () => { window.removeEventListener("storage", syncRole); window.removeEventListener("hiilbox-auth-changed", syncRole as EventListener); };
  }, []);

  const roleContent = useMemo(() => {
    const clone: any[] = JSON.parse(JSON.stringify(SidebarContent));
    const dashboard = clone.find((x) => x.id === 1);
    const section = dashboard?.items?.find((x: any) => x.heading === "Dashboards");
    if (section) {
      const byName = new Map((section.children || []).map((x: any) => [x.name, x]));
      if (role === "admin") {
        section.children = [
          { ...(byName.get("Overview") || {}), name: "Home" }, byName.get("Campaigns"), byName.get("Donations"), byName.get("Withdrawals"), byName.get("Donors"), byName.get("Fundraisers"), byName.get("Analytics"),
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
    return role === "admin" ? clone : clone.filter((x) => x.id === 1);
  }, [role]);

  const selectedContent = roleContent.find(
    (data) => data.id === selectedIconId
  ) || roleContent[0];

  const pathname = usePathname();

  function findActiveUrl(narray: any, targetUrl: any) {
    for (const item of narray) {
      // Check if the `items` array exists in the top-level object
      if (item.items) {
        // Iterate through each item in the `items` array
        for (const section of item.items) {
          // Check if `children` array exists and search through it
          if (section.children) {
            for (const child of section.children) {
              if (child.url === targetUrl) {
                return item.id; // Return the ID of the first-level object
              }
            }
          }
        }
      }
    }
    return null; // URL not found
  }

  useEffect(() => {
    if (role !== "admin" && selectedIconId !== 1) {
      setSelectedIconId(1);
      return;
    }
    const result = findActiveUrl(roleContent, pathname);
    if (result) setSelectedIconId(result);
  }, [pathname, role, roleContent, selectedIconId, setSelectedIconId]);

  return (
    <div className="flex relative">
      {/* Mini Sidebar with Icons */}
      <div className="minisidebar-icon border-e border-ld bg-white dark:bg-darkgray w-[4.5rem] h-screen fixed top-0 start-0 z-[1]">
        <IconSidebar />
        <SideProfile />
      </div>

      {/* Main Sidebar */}
      <aside className="fixed menu-sidebar start-[4.5rem] top-0 h-full w-[260px] dark:!bg-darkgray  rtl:pe-4 rtl:ps-0  ">
        {/* Scrollable Content */}
        <SimpleBar className="h-[calc(100vh-32px)] ">
          <div className=" pt-8  ps-4 rtl:pe-4 rtl:ps-0 pe-4">
            {selectedContent &&
              selectedContent.items?.map((item: any, index: number) => (
                <div className="  mb-4" key={item.heading}>
                  <h5 className="text-link dark:text-white  font-semibold  text-sm mb-2">
                    {item.heading}
                  </h5>

                  {item.children?.map((child: any, idx: number) => (
                    <React.Fragment key={child.id || idx}>
                      {child.children ? (
                        <NavCollapse item={child} />
                      ) : (
                        <NavItems item={child} />
                      )}
                    </React.Fragment>
                  ))}

                  {/* Separator between menu groups */}
                  {index < (selectedContent?.items?.length || 0) - 1 && (
                    <Separator className="my-4 border-b border-dashed border-border dark:border-darkborder" />
                  )}
                </div>
              ))}
          </div>
        </SimpleBar>
      </aside>
    </div>
  );
};

export default SidebarLayout;
