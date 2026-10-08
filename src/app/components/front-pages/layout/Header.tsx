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
        <div className="container-1218 mx-auto flex justify-between items-center gap-4">
          
          {/* =========================================
              LEFT NAVIGATION (Search, Donate, Fundraise)
          ========================================= */}
          <div className="hidden xl:flex items-center gap-8">
            <Link href="/campaigns" className={navClass}>Search</Link>
            
            {/* Optional Left Dropdown (Like Donate) */}
            <div className="group relative py-4 -my-4">
              <button className={`${navClass} flex items-center gap-1`}>
                Donate
                <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <Link href="/create-campaign" className={navClass}>Fundraise</Link>
          </div>
          <div>
            <Link href="/">
              <FullLogo />
            </Link>
          </div>
          {/* =========================================
              RIGHT NAVIGATION & AUTHENTICATION
          ========================================= */}
          <div className="hidden xl:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              
              {/* ABOUT MEGA MENU */}
              <div className="group relative py-4 -my-4">
                <button className={`${navClass} flex items-center gap-1`}>
                  About
                  <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Card */}
                {/* 
                  Note: The 'top-[100%]' and 'pt-6' ensure the menu spawns exactly below the header
                  without a gap that would cause the hover state to cancel.
                */}
                <div className="absolute right-0 top-[100%] pt-6 invisible opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 z-50">
                  <div className="w-[520px] rounded-2xl bg-white dark:bg-darkgray p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-100 dark:border-gray-800">
                    
                    {/* Card Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-medium text-dark dark:text-white">How it works, pricing, and more</span>
                    </div>

                    {/* Two-Column Links Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <Link href="/how-it-works" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">How Hiilbox works</Link>
                      <Link href="/frontend-pages/aboutus" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">About Hiilbox</Link>
                      <Link href="/guarantee" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Hiilbox Giving Guarantee</Link>
                      <Link href="/newsroom" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Newsroom</Link>
                      <Link href="/countries" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Supported countries</Link>
                      <Link href="/careers" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Careers</Link>
                      <Link href="/pricing" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Pricing</Link>
                      <Link href="/foundation" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Hiilbox.org</Link>
                      <Link href="/help" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Help Center</Link>
                      <Link href="/partnerships" className="text-[15px] text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">Hiilbox Partnerships</Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/campaigns" className={navClass}>Campaigns</Link>
            </nav>

            {/* AUTH BUTTONS */}
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-6 ml-2">
              {loggedIn ? (
                <>
                  <Button asChild className="font-bold">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button type="button" variant="outline" className="font-bold" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild className="font-bold">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>

          <MobileMenu />
        </div>
      </header>
    </>
  );
};

export default FrontHeader;