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
            <Link href="/campaigns" className={navClass}>Donate</Link>
            <Link href="/create-campaign" className={navClass}>Fundraise</Link>
          </nav>

          <Link href="/" className="shrink-0" aria-label="Hiilbox home">
            <Image src="https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp" alt="Hiilbox" width={150} height={50} style={{ width: "auto", height: "50px" }} priority />
          </Link>

          <div className="hidden items-center gap-8 xl:flex">
            <nav className="flex items-center gap-8">
              <Link href="/" className={navClass}>About</Link>
              <Link href="/campaigns" className={navClass}>Campaigns</Link>
              <Link href="/" className={navClass}>Contact</Link>
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
