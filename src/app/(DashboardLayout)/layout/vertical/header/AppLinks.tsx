"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";
import * as AppsData from "./Data";
import Link from "next/link";
import Quicklinks from "./Quicklinks";
import { IconHelp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SimpleBar from "simplebar-react";

const AppLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="relative group">
        <span className="h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover:bg-lightprimary group-hover:text-primary xl:flex hidden">
          <Icon icon="solar:widget-3-line-duotone" height={20} />
        </span>

        {/* Mobile Trigger with Sheet from ShadCN */}
        <span
          className="xl:hidden block h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover:bg-lightprimary group-hover:text-primary "
          onClick={() => setIsOpen(true)}
        >
          <Icon icon="solar:widget-3-line-duotone" height={20} />
        </span>

        {/* Desktop Dropdown */}
        <div className="sm:w-[900px] w-screen dropdown  invisible  group-hover:visible absolute">
          <div className="xl:relative xl:transform-none xl:h-auto xl:bg-transparent xl:z-[0] xl:w-[900px] w-64 bg-white dark:bg-darkgray">
            <SimpleBar className="md:h-auto h-[calc(100vh_-_50px)]">
              <div className="grid grid-cols-12 w-full">
                <div className="xl:col-span-8 col-span-12 flex items-stretch xl:px-5 xl:pr-0  px-5 py-5">
                  <div className="grid grid-cols-12 gap-3 w-full">
                    {AppsData.appsLink.map((links, index) => (
                      <div
                        className="col-span-12 xl:col-span-6 flex items-stretch"
                        key={index}
                      >
                        <ul>
                          <li>
                            <Link
                              href={links.href}
                              className="flex gap-3 items-center hover:text-primary group relative"
                            >
                              <span className="bg-lighthover dark:bg-darkgray  h-10 w-10 flex justify-center items-center rounded-full">
                                <Image
                                  src={links.avatar}
                                  width={20}
                                  height={20}
                                  alt="materialm"
                                />
                              </span>
                              <div>
                                <h6 className="font-semibold text-sm text-ld hover:text-primary mb-1 ">
                                  {links.title}
                                </h6>
                                <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                                  {links.subtext}
                                </p>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-12 md:col-span-12 border-t border-border dark:border-darkborder hidden xl:flex items-stretch pt-4 pr-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center text-dark dark:text-darklink">
                          <i className="ti ti-help text-lg "></i>
                          <Link
                            href={"/theme-pages/faq"}
                            className="text-sm font-semibold hover:text-primary ml-2 flex gap-2 items-center"
                          >
                            <IconHelp width={20} />
                            Frequently Asked Questions
                          </Link>
                        </div>
                        <Button>Check</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-4 col-span-12  flex items-stretch">
                  <Quicklinks />
                </div>
              </div>
            </SimpleBar>
          </div>
        </div>

        {/* Mobile Sheet using ShadCN */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="right"
            className="p-0 w-64 sm:w-[90%] md:w-[500px] lg:w-[700px]"
          >
            <SimpleBar className="h-full">
              <div className="grid grid-cols-12 w-full">
                <div className="col-span-12 flex items-stretch px-5 py-5">
                  <div className="grid grid-cols-12 gap-3 w-full">
                    {AppsData.appsLink.map((links, index) => (
                      <div
                        className="col-span-12 sm:col-span-6 flex items-stretch"
                        key={index}
                      >
                        <ul>
                          <li>
                            <Link
                              href={links.href}
                              className="flex gap-3 items-center hover:text-primary group relative"
                            >
                              <span className="bg-lightprimary h-10 w-10 flex justify-center items-center rounded-md">
                                <Image
                                  src={links.avatar}
                                  width={20}
                                  height={20}
                                  alt="materialm"
                                />
                              </span>
                              <div>
                                <h6 className="font-semibold text-sm text-ld hover:text-primary mb-1">
                                  {links.title}
                                </h6>
                                <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                                  {links.subtext}
                                </p>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-12 border-t border-border dark:border-darkborder pt-4 pr-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center text-dark dark:text-darklink">
                          <i className="ti ti-help text-lg "></i>
                          <Link
                            href={"/theme-pages/faq"}
                            className="text-sm font-semibold hover:text-primary ml-2 flex gap-2 items-center"
                          >
                            <IconHelp width={20} />
                            Frequently Asked Questions
                          </Link>
                        </div>
                        <Button>Check</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 flex items-stretch px-5 pb-5">
                  <Quicklinks />
                </div>
              </div>
            </SimpleBar>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AppLinks;
