"use client";
import React from "react";
import { ChildItem } from "../Sidebaritems";
import NavItems from "../NavItems";
import { Icon } from "@iconify/react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface NavCollapseProps {
  item: ChildItem;
  isMini?: boolean;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ item, isMini }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isActive = item.children?.some((child: any) => child.url === pathname);
  const [open, setOpen] = React.useState(!!isActive);

  React.useEffect(() => {
    if (isActive) setOpen(true);
    if (isMini) setOpen(false); // Prevents drop-down overlap in mini mode
  }, [pathname, item.children, isActive, isMini]);

  return (
    <Collapsible open={open && !isMini} onOpenChange={setOpen} className="flex flex-col">
      <CollapsibleTrigger asChild aria-controls={`nav-collapse-${item.name}`}>
        <button
          type="button"
          title={isMini ? t(`${item.name}`) : ""}
          className={twMerge(
            "!text-[15px] flex w-full items-center rounded-full py-2.5 cursor-pointer !leading-normal text-link dark:text-white font-normal hover:transform hover:translate-x-1 transition-all duration-200 ease-in-out",
            "hover:bg-lightprimary dark:hover:bg-darkprimary hover:text-primary dark:hover:text-primary",
            isMini ? "justify-center px-0 w-12 h-12 mx-auto" : "justify-between text-start px-4 gap-3"
          )}
        >
          <div className={`flex items-center ${isMini ? "justify-center w-full" : "gap-3"}`}>
            {item.icon && <Icon icon={item.icon} height={21} className="shrink-0 transition-colors duration-200" />}
            {!isMini && <span className="truncate">{t(`${item.name}`)}</span>}
          </div>
          {!isMini && (
            <HiOutlineChevronDown
              aria-hidden
              className={twMerge("transition-transform duration-200 shrink-0", open ? "rotate-180" : "rotate-0")}
            />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col pb-2 pl-1 overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {!isMini && item.children?.map((child: any) =>
          child.children ? (
            <NavCollapse key={child.id} item={child} isMini={isMini} />
          ) : (
            <NavItems key={child.id} item={child} isInsideCollapse isMini={isMini} />
          )
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
export default NavCollapse;