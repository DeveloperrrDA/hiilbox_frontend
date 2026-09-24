"use-client";
import { useContext } from "react";
import { Icon } from "@iconify/react";
import Miniicons from "./MiniSidebar";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import Logo from "../../shared/logo/Logo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export const IconSidebar = () => {
  const { selectedIconId, setSelectedIconId, setIsCollapse } =
    useContext(CustomizerContext) || {};
  // Handle icon click
  const handleClick = (id: any) => {
    setSelectedIconId(id);
    setIsCollapse("full-sidebar");
  };

  return (
    <>
      <div className="px-4 py-6 pt-7 logo">
        <Logo />
      </div>
      <SimpleBar className="miniicons">
        <TooltipProvider delayDuration={0}>
          {Miniicons.map((links, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  key={index}
                  className={`group relative p-0.5 text-center font-medium h-12 w-12 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center mx-auto mb-2 text-primary bg-lightprimary 
                    [&_svg]:size-6 [&_svg]:shrink-6
                    ${
                      links.id === selectedIconId
                        ? "text-primary bg-lightprimary"
                        : "text-darklink bg-transparent"
                    }`}
                  onClick={() => handleClick(links.id)}
                >
                  <Icon
                    icon={links.icon}
                    height={24}
                    width={24}
                    className="dark:bg-blue "
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                {links.tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </SimpleBar>
    </>
  );
};
