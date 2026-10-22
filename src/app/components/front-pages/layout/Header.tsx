"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
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
        <Icon icon="tabler:search" className="mr-2 inline-flex text-xl" />
      Search Campaigns
    </Link>

{/* ABOUT MEGA MENU — RESTORED */}
<div className="group relative py-4 -my-4">
  <button
    type="button"
    className={`${navClass} font-bold flex items-center gap-1`}
  >
    <span className="font-bold">About</span>
    <svg
      className="h-4 w-4 font-bold opacity-70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>

  {/* Original dropdown card */}
  <div className="absolute right-0 top-[100%] pt-6 invisible opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 z-50">
    <div className="w-[520px] rounded-2xl bg-white dark:bg-darkgray p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-100 dark:border-gray-800">

      {/* Card header */}
      <div className="flex items-center gap-3 mb-6">
        <svg
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-lg font-medium text-dark dark:text-white">
          How it works, pricing, and more
        </span>
      </div>

      {/* Original two-column links */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {[
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
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </div>
</div>

  </div>

  {/* CENTERED LOGO */}
  <div className="absolute left-1/2 -translate-x-1/2">
    <FullLogo />
  </div>

  {/* RIGHT NAVIGATION */}
  <div className="ml-auto hidden xl:flex items-center gap-3">
    <Button
      asChild
      className="bg-transparent font-bold border border-1 border-dark dark:border-white text-dark dark:text-white hover:text-white hover:bg-[#018d42] hover:border-[#018d42] transition-colors"
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
      <Button asChild className="bg-transparent font-bold border border-1 border-dark dark:border-white text-dark dark:text-white hover:text-white hover:bg-[#018d42] hover:border-[#018d42] transition-colors">
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