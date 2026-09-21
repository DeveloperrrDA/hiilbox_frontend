"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import MobileDemosMenu from "./MobileDemoMenus";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
const MobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  return (
    <>
      <div className="lg:hidden flex">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center text-dark  h-10 w-10 rounded-full bg-transparent hover:bg-lightprimary"
            >
              <IconMenu2 />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-6 w-[280px] overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>
                <FullLogo />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <MobileDemosMenu />
              <Link
                className="block py-3 text-base text-ld font-semibold"
                href="https://wrappixel.github.io/premium-documentation-wp/nextjs/materialm/index.html"
                target="_blank"
              >
                Documentation
              </Link>
              <Link
                className="block py-3 text-base text-ld font-semibold"
                href={"https://support.wrappixel.com/"}
                target="_blank"
              >
                Support
              </Link>

              <Button className="mt-2 w-full" asChild>
                <Link href="/auth/auth2/login">Login</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileDrawer;
