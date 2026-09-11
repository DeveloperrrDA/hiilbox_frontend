"use client";

import React, { useContext, useEffect } from "react";

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

const SidebarLayout = () => {
  const { isCollapse, activeDir, selectedIconId, setSelectedIconId } =
    useContext(CustomizerContext);

  const selectedContent = SidebarContent.find(
    (data) => data.id === selectedIconId
  );

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
    const result = findActiveUrl(SidebarContent, pathname);
    if (result) {
      setSelectedIconId(result);
    }
  }, [pathname, setSelectedIconId]);

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
              selectedContent.items?.map((item, index) => (
                <div className="  mb-4" key={item.heading}>
                  <h5 className="text-link dark:text-white  font-semibold  text-sm mb-2">
                    {item.heading}
                  </h5>

                  {item.children?.map((child, idx) => (
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
