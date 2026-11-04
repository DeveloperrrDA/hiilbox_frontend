"use client";
import React from "react";
import { ChildItem } from "../Sidebaritems";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface NavItemsProps {
  item: ChildItem;
  isInsideCollapse?: boolean;
  isMini?: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ item, isInsideCollapse, isMini }) => {
  const { setOpen } = useSidebar();
  const pathname = usePathname();
  const { t } = useTranslation();
  const isExternal = /^https?:\/\//.test(item.url);

  const handleClick = (e: React.MouseEvent) => {
    if (isExternal) {
      e.preventDefault();
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
    setOpen(false);
  };

  return (
    <Link href={item.url} onClick={handleClick}>
      <SidebarMenuItem
        className={`list-none hover:transform hover:translate-x-1 transition-all duration-200 ease-in-out py-3 mb-0.5 !text-[15px] leading-[normal] rounded-full
          ${
            item.disabled
              ? "opacity-50 cursor-default hover:bg-transparent text-link dark:text-white/70 hover:text-link"
              : item.url === pathname
              ? isInsideCollapse
                ? "!text-primary bg-transparent"
                : `${item.icon ? "!text-primary" : "!text-link"} bg-lightprimary`
              : isInsideCollapse
              ? "text-link dark:text-white hover:text-primary bg-transparent group/icon"
              : "text-link dark:text-white hover:text-primary bg-transparent hover:bg-lightprimary group/icon"
          }
          ${isMini ? "flex justify-center px-0 mx-auto w-12 h-12 items-center" : "px-4 gap-3 text-start"}
        `}
        title={isMini ? t(`${item.name}`) : ""}
      >
        <SidebarMenuButton
          asChild
          className="p-0 !h-auto rounded-none !bg-transparent !text-inherit !hover:bg-transparent !hover:text-primary !focus-visible:ring-0 !active:bg-transparent !active:text-inherit !peer-hover/menu-button:text-primary"
        >
          <span className={`flex items-center truncate rtl:text-right ${isMini ? "justify-center w-full" : "gap-3 w-full"}`}>
            {item.icon ? (
              <Icon icon={item.icon} className={`${item.color} shrink-0`} height={21} width={21} />
            ) : (
              <span className={`${item.url === pathname ? "rounded-full mx-1 bg-transparent border border-primary size-2" : "size-2 bg-transparent border border-dark dark:border-darklink rounded-full mx-1"}`}></span>
            )}
            {!isMini && (
              <div className="flex-1 truncate leading-normal">
                {t(`${item.name}`)}
                {(item as any).subtitle && <p className="text-xs mt-1">{t(`${(item as any).subtitle}`)}</p>}
              </div>
            )}
            {!isMini && item.badge && item.badgeType === "filled" && (
              <Badge className="ms-auto shrink-0">{item.badgeContent}</Badge>
            )}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </Link>
  );
};
export default NavItems;