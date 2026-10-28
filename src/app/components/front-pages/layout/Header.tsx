"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
import MobileMenu from "./MobileMenu";
import { useHiilboxAuth } from "@/hooks/useHiilboxAuth";

const FrontHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/campaigns?search=${encodeURIComponent(query)}`);
  };

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

  const navClass =
    "text-sm font-semibold text-dark dark:text-white transition-colors hover:text-primary dark:hover:text-primary";

  return (
    <>
      <header
        // FIXED: Using 'sticky' instead of 'fixed' for native, jump-free scrolling behavior
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isSticky
            ? "bg-white py-4 shadow-md dark:bg-dark"
            : "bg-lightgray py-5 dark:bg-darkgray lg:py-9"
        }`}
      >
        {/* FIXED: Added px-4 xl:px-0 so content isn't pushed off the edge on mobile screens */}
        <div className="container-1218 mx-auto flex items-center justify-between gap-4 px-4 xl:px-0">
          
          {/* MOBILE LOGO (Hidden on desktop) */}
          <div className="flex shrink-0 xl:hidden">
            <FullLogo />
          </div>

          {/* LEFT NAVIGATION (Desktop only) */}
          <div className="hidden xl:flex items-center gap-8">
            {/* SEARCH CAMPAIGNS HOVER MENU */}
            <div className="group relative -my-4 py-4">
              <Link
                href="/campaigns"
                className={`${navClass} inline-flex items-center gap-2`}
              >
                <Icon icon="tabler:search" className="text-xl" />
                Search Campaigns
              </Link>

              <div className="invisible absolute left-0 top-full z-50 w-[340px] -translate-y-1 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <form
                  onSubmit={handleSearch}
                  role="search"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-darkgray"
                >
                  <Icon icon="tabler:search" className="text-xl text-gray-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search campaigns..."
                    aria-label="Search campaigns"
                    className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#01A14B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#018d42]"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* ABOUT MEGA MENU */}
            <div className="group relative -my-4 py-4">
              <button
                type="button"
                className={`${navClass} flex items-center gap-1 font-bold`}
              >
                <span className="font-bold">About</span>
                <svg
                  className="h-4 w-4 opacity-70"
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

              <div className="invisible absolute left-0 top-[100%] z-50 translate-y-1 pt-6 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="w-[520px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:border-gray-800 dark:bg-darkgray dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                  <div className="mb-6 flex items-center gap-3">
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
                        className="text-[15px] font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP LOGO */}
          <div className="hidden xl:absolute xl:left-1/2 xl:block xl:-translate-x-1/2">
            <FullLogo />
          </div>

          {/* RIGHT NAVIGATION (Desktop only) */}
          <div className="hidden items-center gap-3 xl:flex">
            <Button
              asChild
              className="border border-dark bg-transparent font-bold text-dark transition-colors hover:border-[#018d42] hover:bg-[#018d42] hover:text-white dark:border-white dark:text-white"
            >
              <Link href="/signup?type=fundraiser">Start a HiilBox</Link>
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
              <Button
                asChild
                className="border border-dark bg-transparent font-bold text-dark transition-colors hover:border-[#018d42] hover:bg-[#018d42] hover:text-white dark:border-white dark:text-white"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* MOBILE MENU TRIGGER */}
          {/* FIXED: Added shrink-0 so it doesn't get squeezed out of view by the logo */}
          <div className="flex shrink-0 xl:hidden">
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default FrontHeader;