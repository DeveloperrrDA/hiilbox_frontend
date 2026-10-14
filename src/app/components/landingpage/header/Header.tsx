"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
import PagesMenu from "./Pagesmenu";
import DemosMenu from "./DemosMenu";
import MobileDrawer from "./MobileDrawer";
import FrontPageMenu from "./FrontPageMenu";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
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

  return (
    <>
      <header
        className={`top-0 z-50 ${
          isSticky
            ? "bg-white dark:bg-dark shadow-md fixed w-full"
            : "bg-white dark:bg-dark"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between py-6 ">
          <FullLogo />
          <MobileDrawer />
          <nav className="hidden lg:flex gap-6 items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-4">
                <NavigationMenuItem>
                  <DemosMenu />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <FrontPageMenu />
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <PagesMenu />
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="https://wrappixel.github.io/premium-documentation-wp/nextjs/materialm/index.html"
                    target="_blank"
                    className="py-1.5 px-4 text-base text-ld hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary"
                  >
                    Documentation
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="https://support.wrappixel.com/"
                    target="_blank"
                    className="py-1.5 px-4 text-base text-ld hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary"
                  >
                    Support
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button asChild>
                    <Link href="/auth/auth1/login" className=" px-5 py-2">
                      Login
                    </Link>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
