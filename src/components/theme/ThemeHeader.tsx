"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHiilboxAuth } from "@/hooks/useHiilboxAuth";

export default function ThemeHeader() {
  const [sticky, setSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const { loggedIn, logout } = useHiilboxAuth();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = "text-sm font-semibold text-[#111c2d] transition hover:text-[#01A14B]";

  return (
    <>
      <div className="bg-[#111c2d] px-4 py-2 text-center text-xs font-medium text-white">
        Secure Somali crowdfunding · Transparent donations · Community impact
      </div>
      <header className={`${sticky ? "fixed left-0 right-0 top-0 shadow-md" : "relative"} z-50 bg-[#f8fafd]/95 backdrop-blur`}>
        <div className="container-1218 flex min-h-[84px] items-center justify-between gap-6">
          <nav className="hidden items-center gap-8 xl:flex">
            <Link href="/campaigns" className={navClass}>Search</Link>
            
            {/* Left Side Mega Menu Example (Optional, similar to GoFundMe Donate/Fundraise dropdowns) */}
            <div className="group relative py-6">
              <button className={`${navClass} flex items-center gap-1`}>
                Donate
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
            
            <Link href="/create-campaign" className={navClass}>Fundraise</Link>
          </nav>

          <Link href="/" className="shrink-0" aria-label="Hiilbox home">
            <Image src="https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp" alt="Hiilbox" width={150} height={50} style={{ width: "auto", height: "50px" }} priority />
          </Link>

          <div className="hidden items-center gap-8 xl:flex">
            <nav className="flex items-center gap-8">
              
              {/* =========================================
                  ABOUT MEGA MENU (Hover Trigger)
              ========================================= */}
              <div className="group relative py-6">
                <button className={`${navClass} flex items-center gap-1`}>
                  About
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Card */}
                <div className="absolute right-0 top-[70px] invisible opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 z-50">
                  <div className="w-[520px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
                    
                    {/* Card Header */}
                    <div className="flex items-center gap-3 text-[#111c2d] mb-6">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-medium text-gray-700">How it works, pricing, and more</span>
                    </div>

                    {/* Two-Column Links Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <Link href="/how-it-works" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">How Hiilbox works</Link>
                      <Link href="/about" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">About Hiilbox</Link>
                      <Link href="/guarantee" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Hiilbox Giving Guarantee</Link>
                      <Link href="/newsroom" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Newsroom</Link>
                      <Link href="/countries" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Supported countries</Link>
                      <Link href="/careers" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Careers</Link>
                      <Link href="/pricing" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Pricing</Link>
                      <Link href="/foundation" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Hiilbox.org</Link>
                      <Link href="/help" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Help Center</Link>
                      <Link href="/partnerships" className="text-[15px] text-gray-600 hover:text-[#01A14B] font-medium transition-colors">Hiilbox Partnerships</Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/campaigns" className={navClass}>Campaigns</Link>
              <Link href="/contact" className={navClass}>Contact</Link>
            </nav>
            {loggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="rounded-lg bg-[#01A14B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#018d42]">Dashboard</Link>
                <button type="button" onClick={logout} className="rounded-lg border border-[#01A14B] bg-white px-5 py-3 text-sm font-bold text-[#01A14B] transition hover:bg-[#01A14B] hover:text-white">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="rounded-lg bg-[#01A14B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#018d42]">Login</Link>
            )}
          </div>

          <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg border border-[#e0e6eb] bg-white px-3 py-2 text-sm font-bold text-[#111c2d] xl:hidden" aria-expanded={open}>
            Menu
          </button>
        </div>

        {open && (
          <div className="border-t border-[#e0e6eb] bg-white px-5 py-5 xl:hidden">
            <div className="container-1218 flex flex-col gap-4">
              <Link href="/campaigns" className={navClass}>Explore campaigns</Link>
              <Link href="/create-campaign" className={navClass}>Start a fundraiser</Link>
              {loggedIn ? (
                <>
                  <Link href="/dashboard" className="rounded-lg bg-[#01A14B] px-5 py-3 text-center text-sm font-bold text-white">Dashboard</Link>
                  <button type="button" onClick={logout} className="rounded-lg border border-[#01A14B] bg-white px-5 py-3 text-center text-sm font-bold text-[#01A14B]">Logout</button>
                </>
              ) : (
                <Link href="/login" className="rounded-lg bg-[#01A14B] px-5 py-3 text-center text-sm font-bold text-white">Login</Link>
              )}
            </div>
          </div>
        )}
      </header>
      {sticky && <div className="h-[84px]" />}
    </>
  );
}