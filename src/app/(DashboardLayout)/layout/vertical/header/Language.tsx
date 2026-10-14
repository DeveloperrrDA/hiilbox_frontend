"use client";
import { useContext, useEffect, useState } from "react";

import { CustomizerContext } from "@/app/context/CustomizerContext";
import Image from "next/image";
import i18n from "@/utils/i18n";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Languages = [
  {
    flagname: "English (UK)",
    icon: "/images/flag/icon-flag-en.svg",
    value: "en",
  },
  {
    flagname: "中国人 (Chinese)",
    icon: "/images/flag/icon-flag-cn.svg",
    value: "ch",
  },
  {
    flagname: "français (French)",
    icon: "/images/flag/icon-flag-fr.svg",
    value: "fr",
  },
  {
    flagname: "عربي (Arabic)",
    icon: "/images/flag/icon-flag-sa.svg",
    value: "ar",
  },
];

export const Language = () => {
  const { isLanguage, setIsLanguage, activeDir } =
    useContext(CustomizerContext);

  const currentLang =
    Languages.find((_lang) => _lang.value === isLanguage) || Languages[1];

  useEffect(() => {
    i18n.changeLanguage(isLanguage);
  }, [isLanguage, i18n]);

  return (
    <div className="relative group/menu">
      <DropdownMenu dir={activeDir === "rtl" ? "rtl" : "ltr"}>
        <DropdownMenuTrigger asChild>
          <span className="h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary">
            <Image
              src={currentLang.icon}
              alt="language"
              width={100}
              height={100}
              className="rounded-full h-6 w-6 object-cover cursor-pointer"
            />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 rounded-sm p-0">
          {Languages.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => setIsLanguage(item.value)}
              className="flex gap-3 items-center p-3 w-full cursor-pointer"
            >
              <Image
                src={item.icon}
                alt={item.flagname}
                className="rounded-full object-cover h-6 w-6"
                width={100}
                height={100}
              />
              <span>{item.flagname}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
