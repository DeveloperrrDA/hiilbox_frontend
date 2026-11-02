"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";

export default function SideProfile({ isMini }: { isMini?: boolean }) {
  const [user, setUser] = useState<any>(null);
  useEffect(() => setUser(savedDashboardUser()), []);
  const role = dashboardRole(user);
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.display_name || user?.username || "User";
  
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    window.dispatchEvent(new Event("hiilbox-auth-changed"));
    window.location.href = "/login";
  };

  return (
    <div className="relative group/menu w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={`flex items-center w-full rounded-full cursor-pointer hover:bg-lightprimary group-hover/menu:bg-lightprimary p-2 transition-colors ${isMini ? "justify-center" : "gap-3"}`}>
            <span className="h-10 w-10 shrink-0 rounded-full flex justify-center items-center">
              <Image
                src={user?.avatar_url || "/images/profile/user-1.jpg"}
                alt="profile"
                height={40}
                width={40}
                className="rounded-full object-cover h-full w-full border border-dashed border-transparent hover:border-primary transition-colors p-0.5"
              />
            </span>
            {!isMini && (
              <div className="flex-1 min-w-0 flex flex-col justify-center text-start">
                <h5 className="text-sm font-semibold truncate text-ld">{name}</h5>
                <span className="text-xs capitalize text-darklink truncate">{role}</span>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-screen sm:w-[360px] py-6 !shadow-lg rounded-sm" side="right" align="end">
          <div className="px-6">
            <h3 className="text-lg font-semibold text-ld">User Profile</h3>
            <div className="flex items-center gap-6 pb-5 border-b dark:border-darkborder mt-5 mb-3">
              <Image src={user?.avatar_url || "/images/profile/user-1.jpg"} alt="profile" height={80} width={80} className="rounded-full object-cover h-20 w-20" />
              <div className="min-w-0">
                <h5 className="font-semibold text-lg truncate">{name}</h5>
                <span className="capitalize text-sm text-darklink">{role}</span>
                {user?.email && (
                  <p className="text-sm text-darklink mb-0 mt-1 flex items-center truncate">
                    <Icon icon="solar:mailbox-line-duotone" className="text-base me-1 shrink-0" />
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="pt-4 px-6">
            <Button onClick={logout} className="w-full rounded-full">
              Logout
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}