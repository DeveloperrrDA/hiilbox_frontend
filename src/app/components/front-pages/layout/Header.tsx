"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
// import { Leftnavigation, Rightnavigation } from "./Navigation"; // Replaced with inline mega menu
import MobileMenu from "./MobileMenu";
import { useHiilboxAuth } from "@/hooks/useHiilboxAuth";

const FrontHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { loggedIn, logout } = useHiilboxAuth();

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

  // Shared navigation class with dark mode support
  const navClass = "text-sm font-semibold text-dark dark:text-white transition-colors hover:text-primary dark:hover:text-primary";

  return (
    <>
      <header
        className={`top-0 z-50 ${
          isSticky
            ? "bg-white dark:bg-dark shadow-md fixed w-full py-5"
            : "bg-lightgray dark:bg-darkgray lg:py-9 py-5"
        }`}
      >
      <div className="container-1218 mx-auto relative flex items-center justify-between gap-4">

  {/* LEFT NAVIGATION */}
  <div className="hidden xl:flex items-center gap-8">
    <Link href="/campaigns" className={navClass}>
      Search Campaigns
    </Link>

    <Link href="/about" className={navClass}>
      About Us
    </Link>
  </div>

  {/* CENTERED LOGO */}
  <div className="absolute left-1/2 -translate-x-1/2">
    <FullLogo />
  </div>

  {/* RIGHT NAVIGATION */}
  <div className="ml-auto hidden xl:flex items-center gap-3">
    <Button
      asChild
      className="bg-[#01A14B] font-bold text-white hover:bg-[#018d42]"
    >
      <Link href="/signup?type=fundraiser">
        Start a HiilBox
      </Link>
    </Button>

    {loggedIn ? (
      <>
        <Button asChild className="font-bold">
          <Link href="/dashboard">Dashboard</Link>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="font-bold"
          onClick={logout}
        >
          Logout
        </Button>
      </>
    ) : (
      <Button asChild className="font-bold">
        <Link href="/login">Login</Link>
      </Button>
    )}
  </div>

  {/* MOBILE MENU */}
  <div className="ml-auto xl:hidden">
    <MobileMenu />
  </div>

</div>
      </header>
    </>
  );
};

export default FrontHeader;