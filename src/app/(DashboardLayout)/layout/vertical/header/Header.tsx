"use client";

import React, { useState, useEffect, useContext } from "react";

import Search from "./Search";
import { Icon } from "@iconify/react";
import AppLinks from "./AppLinks";
import Notification from "./Notification";
import Profile from "./Profile";
import { CustomizerContext } from "@/app/context/CustomizerContext";

import { Language } from "./Language";
import FullLogo from "../../shared/logo/FullLogo";
import MobileHeaderItems from "./MobileHeaderItems";
import HorizontalMenu from "../../horizontal/header/HorizontalMenu";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Sidebar from "@/app/(DashboardLayout)/layout/vertical/sidebar/Sidebar";

import { useSidebar } from "@/components/ui/sidebar";
import Messages from "./Messages";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderPropsType {
  layoutType: string;
}

const Header = ({ layoutType }: HeaderPropsType) => {
  const [isSticky, setIsSticky] = useState(false);

  const { toggleSidebar, setOpenMobile, openMobile } = useSidebar();

  const { setIsCollapse, isCollapse, isLayout, setActiveMode, activeMode } =
    useContext(CustomizerContext);

  const [mobileMenu, setMobileMenu] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pathname = usePathname();

  useEffect(() => {
    if (openMobile) {
      setOpenMobile(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMobileMenu = () => {
    if (mobileMenu === "active") {
      setMobileMenu("");
    } else {
      setMobileMenu("active");
    }
  };
  if (!mounted) return null;

  const toggleMode = () => {
    setActiveMode(activeMode === "light" ? "dark" : "light");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-[2] ${
          isSticky
            ? "bg-lightgray dark:bg-dark shadow-md fixed w-full"
            : "bg-transparent"
        }`}
      >
        <nav
          className={`rounded-none bg-transparent dark:bg-transparent py-4 sm:px-7.5 px-4 ${
            layoutType == "horizontal" ? "container mx-auto" : ""
          }  ${isLayout == "full" ? "!max-w-full" : ""}`}
        >
          <div className="mx-auto flex flex-wrap items-center justify-between">
            <span
              onClick={() => setOpenMobile(!openMobile)}
              className="h-10 w-10 flex text-black/60 dark:text-white  xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
            >
              <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
            </span>

            {/* Toggle Icon   */}
            <div className="xl:!block !hidden">
              <div className="flex gap-3 items-center relative">
                {layoutType == "horizontal" ? (
                  <div className="me-3">
                    <FullLogo />
                  </div>
                ) : null}

                {layoutType != "horizontal" ? (
                  <span
                    onClick={() => {
                      if (isCollapse === "full-sidebar") {
                        setIsCollapse("mini-sidebar");
                      } else {
                        setIsCollapse("full-sidebar");
                      }
                    }}
                    className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer"
                  >
                    <Icon
                      icon="solar:hamburger-menu-line-duotone"
                      height={21}
                    />
                  </span>
                ) : null}

                <AppLinks />

                <Search />
              </div>
            </div>
            {/* mobile-logo */}
            <div className="block xl:hidden">
              <FullLogo />
            </div>
            <div className="xl:!block !hidden md:!hidden">
              <div className="flex gap-3 items-center">
                <Button asChild variant="outline" size="sm" className="font-semibold">
                  <Link href="/">
                    <Icon icon="solar:home-2-line-duotone" height={18} />
                    Home
                  </Link>
                </Button>
                {/* Theme Toggle */}
                {activeMode === "light" ? (
                  <div
                    className="h-10 w-10 hover:text-primary hover:bg-lightprimary dark:hover:bg-darkminisidebar  dark:hover:text-primary focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-darklink  dark:text-white"
                    onClick={toggleMode}
                  >
                    <span className="flex items-center">
                      <Icon icon="solar:moon-line-duotone" width="20" />
                    </span>
                  </div>
                ) : (
                  // Dark Mode Button
                  <div
                    className="h-10 w-10 hover:text-primary hover:bg-lightprimary dark:hover:bg-darkminisidebar  dark:hover:text-primary focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-darklink  dark:text-white"
                    onClick={toggleMode}
                  >
                    <span className="flex items-center">
                      <Icon icon="solar:sun-bold-duotone" width="20" />
                    </span>
                  </div>
                )}
                {/* Language Dropdown*/}
                <Language />

                {/* Meassage Dropdown */}
                <Messages />

                {/* Notification Dropdown */}
                <Notification />

                {/* Profile Dropdown */}
                <Profile />
              </div>
            </div>
            {/* Mobile Toggle Icon */}
            <span
              className="h-10 w-10 flex xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
              onClick={handleMobileMenu}
            >
              <Icon icon="tabler:dots" height={21} />
            </span>
          </div>
        </nav>

        <div
          className={`w-full  xl:hidden block mobile-header-menu ${mobileMenu}`}
        >
          <MobileHeaderItems />
        </div>

        {/* Horizontal Menu  */}
        {layoutType == "horizontal" ? (
          <div className="xl:border-y xl:border-ld xl:block hidden">
            <div
              className={`${isLayout == "full" ? "w-full px-6" : "container"}`}
            >
              <HorizontalMenu />
            </div>
          </div>
        ) : null}
      </header>

      {/* Mobile Sidebar */}

      <div className="block">
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className="w-[320px] sm:w-[320px] p-0 max-w-[100vw]"
          >
            <SheetTitle>sidebar</SheetTitle>
            <VisuallyHidden></VisuallyHidden>
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Header;
