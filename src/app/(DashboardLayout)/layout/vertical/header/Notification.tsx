import { Icon } from "@iconify/react";
import Link from "next/link";
import * as Notification from "./Data";
import React, { useContext } from "react";
import Image from "next/image";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import { Button } from "@/components/ui/button";

const Messages = () => {
  const { activeDir } = useContext(CustomizerContext);

  return (
    <div className="relative group/menu">
      <DropdownMenu dir={activeDir === "rtl" ? "rtl" : "ltr"}>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <span className="h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
              <Icon icon="solar:bell-bing-line-duotone" height={20} />
            </span>
            <span className="rounded-full absolute end-1 top-1 bg-error text-[10px] h-4 w-4 flex justify-center items-center text-white">
              5
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-screen sm:w-[360px] py-6  rounded-sm px-0">
          <div className="flex items-center  px-6 justify-between">
            <h3 className="mb-0 text-lg font-semibold text-ld">Notification</h3>
            <Badge variant="primary">5 new</Badge>
          </div>
          <SimpleBar className="max-h-80 mt-3">
            {Notification.Notification.map((links, index) => (
              <DropdownMenuItem
                className="px-6 py-3 flex justify-between items-center bg-hover group/link w-full cursor-pointer"
                key={index}
              >
                <div className="flex items-center  w-full">
                  <div
                    className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${links.bgcolor} `}
                  >
                    <Icon
                      icon={links.icon}
                      height={20}
                      className={links.color}
                    />
                  </div>
                  <div className="ps-4 flex justify-between w-full">
                    <div className="w-3/4 text-start">
                      <h5 className="mb-1 text-sm  group-hover/link:text-primary">
                        {links.title}
                      </h5>
                      <div className="text-xs text-darklink line-clamp-1">
                        {links.subtitle}
                      </div>
                    </div>

                    <div className="text-xs block self-start pt-1.5">
                      {links.time}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </SimpleBar>

          <div className="pt-5 px-6">
            <Button
              color="primary"
              className="w-full  rounded-full"
              variant="outline"
            >
              <Link href="/apps/user-profile/profile">
                See All Notifications
              </Link>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Messages;
