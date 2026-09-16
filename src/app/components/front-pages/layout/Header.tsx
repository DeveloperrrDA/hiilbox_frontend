"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
import { Leftnavigation, Rightnavigation } from "./Navigation";
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

  return (
    <>
      <header
        className={` top-0 z-50 ${
          isSticky
            ? "bg-white dark:bg-dark shadow-md fixed w-full py-5"
            : "bg-lightgray dark:bg-darkgray lg:py-9 py-5 "
        }`}
      >
        <div className="container-1218 mx-auto  flex justify-between items-center">
          
          {/* <MobileDrawer/> */}
          <div className="xl:block hidden">
            <Leftnavigation />
          </div>

          <FullLogo />

          <div className="xl:block hidden">
            <Rightnavigation />
          </div>

          <div className="hidden items-center gap-2 xl:flex">
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
          <MobileMenu />
        </div>
      </header>
    </>
  );
};

export default FrontHeader;
