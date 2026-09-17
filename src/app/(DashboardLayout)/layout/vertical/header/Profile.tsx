"use client";

import { Icon } from "@iconify/react";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CustomizerContext } from "@/app/context/CustomizerContext";
import {
  dashboardRole,
  savedDashboardUser,
} from "@/lib/dashboard/roles";
import { useHiilboxAuth } from "@/hooks/useHiilboxAuth";

const Profile = () => {
  const { activeDir } = useContext(CustomizerContext);
  const { logout } = useHiilboxAuth();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(savedDashboardUser());
  }, []);

  const role = dashboardRole(user);

  const name =
    [user?.first_name, user?.last_name]
      .filter(Boolean)
      .join(" ") ||
    user?.display_name ||
    user?.name ||
    user?.username ||
    user?.user_login ||
    "User";

  const email =
    user?.email ??
    user?.user_email ??
    "";

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part.charAt(0))
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="relative group/menu">
      <DropdownMenu
        dir={activeDir === "rtl" ? "rtl" : "ltr"}
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open user profile"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-lightprimary font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            {initials}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[320px] rounded-md px-0 py-5 shadow-lg sm:w-[360px]">
          {/* User information */}
          <div className="px-6">
            <h3 className="text-lg font-semibold text-ld">
              User Profile
            </h3>

            <div className="mt-5 flex items-center gap-4 border-b border-border pb-5 dark:border-darkborder">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lightprimary text-xl font-semibold text-primary">
                {initials}
              </div>

              <div className="min-w-0">
                <h5 className="truncate font-semibold">
                  {name}
                </h5>

                <span className="text-sm capitalize text-darklink">
                  {role === "guest" ? "User" : role}
                </span>

                {email && (
                  <p className="mt-1 flex items-center text-sm text-darklink">
                    <Icon
                      icon="solar:mailbox-line-duotone"
                      className="me-1 shrink-0 text-base"
                    />

                    <span className="truncate">
                      {email}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="px-3 pt-3">
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lightprimary text-primary">
                  <Icon
                    icon="solar:user-circle-line-duotone"
                    className="text-xl"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    My Profile
                  </p>

                  <p className="text-xs text-darklink">
                    View and manage your profile
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          </div>

          {/* Logout */}
          <div className="px-6 pt-4">
            <Button
              type="button"
              onClick={logout}
              className="w-full rounded-full"
            >
              <Icon
                icon="solar:logout-2-line-duotone"
                className="me-2 text-lg"
              />

              Logout
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;