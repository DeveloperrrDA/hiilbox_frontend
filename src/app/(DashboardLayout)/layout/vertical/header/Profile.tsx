"use client";

import { Icon } from "@iconify/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";

function firstValue(user: any, keys: string[]) {
  for (const key of keys) {
    const value = user?.[key] ?? user?.data?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "";
}

const Profile = () => {
  const { activeDir } = useContext(CustomizerContext);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const sync = () => setUser(savedDashboardUser());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const name = useMemo(() => {
    const first = firstValue(user, ["first_name"]);
    const last = firstValue(user, ["last_name"]);
    return [first, last].filter(Boolean).join(" ") || firstValue(user, ["display_name", "name", "username", "user_login"]) || "User";
  }, [user]);
  const email = firstValue(user, ["email", "user_email"]);
  const role = dashboardRole(user);
  const roleLabel = role === "guest" ? "User" : role.charAt(0).toUpperCase() + role.slice(1);
  const avatar = firstValue(user, ["avatar_url", "avatar", "profile_image", "profile_image_url", "image", "photo", "picture"]);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    sessionStorage.clear();
    router.replace("/auth/auth1/login");
    router.refresh();
  }

  const avatarNode = (size: "small" | "large") => {
    const classes = size === "large" ? "h-20 w-20 text-xl" : "h-9 w-9 text-sm";
    return avatar ? <img src={avatar} alt={name} className={`${classes} rounded-full object-cover`} /> : <span className={`${classes} flex shrink-0 items-center justify-center rounded-full bg-lightprimary font-semibold text-primary`}>{initials}</span>;
  };

  return <div className="relative group/menu">
    <DropdownMenu dir={activeDir === "rtl" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Open user profile menu" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-lightprimary">{avatarNode("small")}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(360px,calc(100vw-24px))] rounded-md px-0 py-5">
        <div className="px-6">
          <h3 className="text-lg font-semibold text-ld">User Profile</h3>
          <div className="mt-5 mb-3 flex items-center gap-5 border-b border-border pb-5 dark:border-darkborder">
            {avatarNode("large")}
            <div className="min-w-0"><h5 className="truncate font-semibold">{name}</h5><span className="text-sm capitalize text-darklink">{roleLabel}</span>{email && <p className="mt-1 flex items-center truncate text-sm text-darklink"><Icon icon="solar:letter-line-duotone" className="me-1 shrink-0" />{email}</p>}</div>
          </div>
        </div>
        <DropdownMenuItem asChild className="mx-2 cursor-pointer px-4 py-3"><Link href="/dashboard/profile" className="flex w-full items-center gap-3"><Icon icon="solar:user-circle-line-duotone" className="text-xl"/><span><span className="block font-medium">My Profile</span><span className="text-xs text-darklink">View your profile</span></span></Link></DropdownMenuItem>
        <DropdownMenuItem asChild className="mx-2 cursor-pointer px-4 py-3"><Link href="/dashboard/settings" className="flex w-full items-center gap-3"><Icon icon="solar:settings-line-duotone" className="text-xl"/><span><span className="block font-medium">Settings</span><span className="text-xs text-darklink">Account and preferences</span></span></Link></DropdownMenuItem>
        <div className="px-6 pt-4"><Button type="button" className="w-full rounded-full" onClick={logout}><Icon icon="solar:logout-2-line-duotone"/> Logout</Button></div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>;
};
export default Profile;
