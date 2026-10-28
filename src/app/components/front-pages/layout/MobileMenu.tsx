"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { IconMenu2 } from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
import { useHiilboxAuth } from "@/hooks/useHiilboxAuth";

// The About links extracted from your Header.tsx
const aboutLinks = [
  ["How Hiilbox works", "/how-it-works"],
  ["About Hiilbox", "/about"],
  ["Hiilbox Giving Guarantee", "/guarantee"],
  ["Newsroom", "/newsroom"],
  ["Supported countries", "/countries"],
  ["Careers", "/careers"],
  ["Pricing", "/pricing"],
  ["Hiilbox.org", "/foundation"],
  ["Help Center", "/help"],
  ["Hiilbox Partnerships", "/partnerships"],
];

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<"main" | "about">("main");
  const { loggedIn, logout } = useHiilboxAuth();

  // Reset the view to 'main' when the drawer is closed so it doesn't open on the wrong view next time
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setActiveView("main"), 300);
    }
  };

  return (
    <>
      <div className="flex xl:hidden">
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            {/* FIXED: Added variant="ghost" and strict gray-900/white text colors so it never disappears */}
            <Button
              variant="ghost"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 text-gray-900 transition-colors hover:bg-lightprimary dark:text-white"
              aria-label="Open menu"
            >
              <IconMenu2 className="h-6 w-6" stroke={2} />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex h-[100dvh] w-[300px] flex-col overflow-hidden bg-white p-6 dark:bg-darkgray sm:w-[320px]"
          >
            {/* PINNED HEADER WITH VISIBLE CLOSE BUTTON */}
            <SheetHeader className="mb-4 flex shrink-0 flex-row items-center justify-between space-y-0">
              <div className="flex items-center">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation drawer for mobile devices
                </SheetDescription>
                <FullLogo />
              </div>
              
              {/* EXPLICIT CLOSE BUTTON */}
              <SheetClose asChild>
                <Button className="flex h-9 w-9 items-center justify-center rounded-full p-0 shadow-sm">
                  <Icon icon="tabler:x" className="text-lg" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </SheetHeader>

            {/* MIDDLE SCROLLABLE / SLIDING AREA */}
            <div className="relative -mx-6 flex-1 overflow-hidden">
              
              {/* --- MAIN MENU VIEW --- */}
              <div 
                className={`absolute inset-0 flex flex-col gap-2 overflow-y-auto px-6 pb-6 transition-transform duration-300 ease-in-out ${
                  activeView === "main" ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <SheetClose asChild>
                  <Link href="/campaigns" className="flex items-center gap-3 border-b border-gray-100 py-3.5 text-[17px] font-semibold text-dark transition-colors hover:text-primary dark:border-gray-800 dark:text-white">
                    <Icon icon="tabler:search" className="text-xl text-gray-400" />
                    Search Campaigns
                  </Link>
                </SheetClose>

                <button
                  onClick={() => setActiveView("about")}
                  className="flex items-center justify-between border-b border-gray-100 py-3.5 text-left text-[17px] font-semibold text-dark transition-colors hover:text-primary dark:border-gray-800 dark:text-white"
                >
                  <span className="flex items-center gap-3">
                    <Icon icon="tabler:info-circle" className="text-xl text-gray-400" />
                    About
                  </span>
                  <Icon icon="solar:alt-arrow-right-linear" className="text-xl opacity-50" />
                </button>
                
                <SheetClose asChild>
                  <Link href="/signup?type=fundraiser" className="flex items-center gap-3 border-b border-gray-100 py-3.5 text-[17px] font-semibold text-dark transition-colors hover:text-primary dark:border-gray-800 dark:text-white">
                    <Icon icon="tabler:heart-handshake" className="text-xl text-gray-400" />
                    Start a HiilBox
                  </Link>
                </SheetClose>
              </div>

              {/* --- ABOUT SUBMENU VIEW --- */}
              <div 
                className={`absolute inset-0 flex flex-col overflow-y-auto pb-6 transition-transform duration-300 ease-in-out ${
                  activeView === "about" ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {/* STICKY BACK BUTTON */}
                <div className="sticky top-0 z-10 mb-2 bg-white/95 px-6 py-3 backdrop-blur-sm dark:bg-darkgray/95">
                  <button
                    onClick={() => setActiveView("main")}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-dark dark:hover:text-white"
                  >
                    <Icon icon="solar:alt-arrow-left-linear" className="text-xl" />
                    Back to Menu
                  </button>
                </div>

                <div className="flex flex-col px-6">
                  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    How it works & more
                  </h3>

                  <div className="flex flex-col">
                    {aboutLinks.map(([label, href]) => (
                      <SheetClose asChild key={href}>
                        <Link
                          href={href}
                          className="py-3 text-[16px] font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                        >
                          {label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* PINNED FOOTER */}
            <SheetFooter className="mt-2 shrink-0 border-t border-gray-100 p-0 pt-6 dark:border-gray-800">
              {loggedIn ? (
                <div className="grid w-full gap-3">
                  <SheetClose asChild>
                    <Button asChild className="w-full rounded-xl py-6 font-bold">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </SheetClose>
                  <Button type="button" variant="outline" className="w-full rounded-xl py-6 font-bold" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <SheetClose asChild>
                  <Button asChild className="mt-2 w-full rounded-xl bg-[#01A14B] py-6 font-bold text-white hover:bg-[#006B30]">
                    <Link href="/login">Log in</Link>
                  </Button>
                </SheetClose>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileMenu;