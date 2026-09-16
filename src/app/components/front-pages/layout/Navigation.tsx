import { Badge } from "@/components/ui/badge"; // <-- Shadcn Badge import

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import React from "react";
const FrontLeftnav = [
  {
    menu: "Search",
    link: "/campaigns",
    badge: false,
    icon: true,
  },
  {
    menu: "Donate",
    link: "/campaigns",
    badge: true,
  },
  {
    menu: "Fundraise",
    link: "/create-campaign",
    badge: false,
    icon: true,
  },
  
];

const FrontRightnav = [
  {
    menu: "About",
    link: "/",
    badge: false,
    icon: true,
  },
  {
    menu: "Campaigns",
    link: "/campaigns",
    badge: false,
  },
  {
    menu: "Contact",
    link: "/frontend-pages/contact",
    badge: false,
  },
]

const Leftnavigation = () => {
  const pathname = usePathname();
  return (
    <>
      <ul className="flex xl:flex-row flex-col xl:gap-9 gap-6 xl:items-center">
        {FrontLeftnav.map((item, index) => (
          <li
            key={index}
            className={`rounded-full font-semibold text-sm py-1.5 px-2.5 ${
              pathname == item.link
                ? "bg-lightprimary text-primary"
                : "text-dark dark:text-white "
            }`}
          >
            <Link
              href={item.link}
              className="flex gap-3 items-center text-primary-ld"
            >
              {item.icon == true && item.menu == "Search" ? (
                <Icon
                                  icon="material-symbols:search-outline-rounded"
                                  height={22}
                                />
              ): null }
              {item.menu}
              {item.badge == true ? (
                <Badge variant={"lightPrimary"}>New</Badge>
              ) : null}
              {item.icon == true && item.menu == "Fundraise" ? (
                <Icon
                                  icon="material-symbols:arrow-drop-down-outline-rounded"
                                  height={22}
                                />
              ): null }
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const Rightnavigation = () => {
  const pathname = usePathname();
  return (
    <>
      <ul className="flex xl:flex-row flex-col xl:gap-9 gap-6 xl:items-center">
        {FrontRightnav.map((item, index) => (
          <li
            key={index}
            className={`rounded-full font-semibold text-sm py-1.5 px-2.5 ${
              pathname == item.link
                ? "bg-lightprimary text-primary"
                : "text-dark dark:text-white "
            }`}
          >
            <Link
              href={item.link}
              className="flex gap-3 items-center text-primary-ld"
            >
              {item.menu}
              {item.badge == true ? (
                <Badge variant={"lightPrimary"}>New</Badge>
              ) : null}
              {item.icon == true && item.menu == "About" ? (
                <Icon
                                  icon="material-symbols:arrow-drop-down-outline-rounded"
                                  height={22}
                                />
              ): null }
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export { Leftnavigation, Rightnavigation };

