"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const LeftSidebarPart = () => {
  return (
    <>
      <div className="circle-top"></div>
      <div>
        <img
          src="https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp"
          alt="Hiilbox"
          className="circle-bottom h-14 w-auto object-contain"
        />
      </div>
      <div className="relative z-10 flex h-screen items-center justify-center">
        <div className="px-6 xl:w-7/12 xl:px-0">
          <h2 className="text-[40px] font-bold leading-[normal] text-white">
            Welcome to<br />Hiilbox
          </h2>
          <p className="my-4 text-base font-medium text-white opacity-75">
            Manage campaigns, follow fundraising progress, and stay connected with the people supporting your cause.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/campaigns">Explore campaigns</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default LeftSidebarPart;
