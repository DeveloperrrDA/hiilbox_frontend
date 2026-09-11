import { Icon } from "@iconify/react/dist/iconify.js";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";

import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";

export const Footer = () => {
  const navLinks1 = [
    {
      key: "link1",
      title: "Cards",
      link: "/widgets/cards",
    },
    {
      key: "link2",
      title: "Pricing",
      link: "/theme-pages/pricing",
    },
    {
      key: "link3",
      title: "Account Settings",
      link: "/theme-pages/account-settings",
    },
    {
      key: "link4",
      title: "FAQ",
      link: "/theme-pages/faq",
    },
    {
      key: "link5",
      title: "Casl",
      link: "/theme-pages/casl",
    },
  ];
  const navLinks2 = [
    {
      key: "link1",
      title: "How to start HiilBox",
      link: "/widgets/banners",
    },
    {
      key: "link2",
      title: "Explore Categories",
      link: "/widgets/charts",
    },
    {
      key: "link3",
      title: "How it Works?",
      link: "/headless-form/radiogroup",
    },
  ];
  const navLinks3 = [
    {
      key: "link1",
      title: "About Us",
      link: "/forms/form-layouts",
    },
    {
      key: "link2",
      title: "Articles & News",
      link: "/tables/basic",
    },
    {
      key: "link3",
      title: "Team",
      link: "/react-tables/basic",
    },
    {
      key: "link4",
      title: "Contact Us",
      link: "/forms/form-elements",
    },
  ];
  return (
    <>
      <div className="bg-dark">
        <div className="container-1218 mx-auto ">
          <div className="border-b border-darkborder lg:py-24 py-12">
            <div className="grid grid-cols-12 gap-10 ">
              <div className="lg:col-span-4 sm:col-span-6 col-span-12">
                <Image
                  src="https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp"
                  alt="logo"
                  className="mb-5"
                  width={150}
                  height={40}
                />
                <div className="flex flex-col gap-4">
                  <p className="text-base leading-8 text-darklink  opacity-80 py-6">
                    Hiilbox is a trusted Somali crowdfunding platform that helps people raise funds for medical needs, education, emergencies, 
                    community projects, and charitable causes. By bringing communities together, Hiilbox makes it easy for people to help each 
                    other and create meaningful impact through secure and transparent fundraising.
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/">
                          <Image
                            src="/images/front-pages/background/facebook.svg"
                            height={22}
                            width={22}
                            alt="icon"
                          />
                        </Link>
                      </TooltipTrigger>

                      <TooltipContent side="bottom" className="text-xs">
                        Facebook
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href="/">
                          <Image
                            src="/images/front-pages/background/twitter.svg"
                            height={22}
                            width={22}
                            alt="icon"
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        Twitter
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href="/">
                          <Image
                            src="/images/front-pages/background/instagram.svg"
                            height={22}
                            width={22}
                            alt="icon"
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        Instagram
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="lg:col-span-2 sm:col-span-6 col-span-12">
                <h4 className="text-17 text-white font-semibold mb-8">
                  Fundraise
                </h4>
                <div className="flex flex-col gap-4">
                  {navLinks2.map((item) => {
                    return (
                      <Link
                        key={item.key}
                        href={item.link}
                        className="text-sm text-lightmuted hover:text-primary block"
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-2 sm:col-span-6 col-span-12">
                <h4 className="text-17 text-white font-semibold mb-8">
                  Resources
                </h4>
                <div className="flex flex-col gap-4">
                  {navLinks3.map((item) => {
                    return (
                      <Link
                        key={item.key}
                        href={item.link}
                        className="text-sm text-lightmuted hover:text-primary block"
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-4 sm:col-span-6 col-span-12">
                <h4 className="text-17 text-white font-semibold mb-8">
                  Follow us
                </h4>
                
              </div>
            </div>
          </div>
        </div>
        <div className="container-1218 mx-auto ">
          <div className="flex md:justify-between justify-center items-center flex-wrap md:py-10 py-8">
            <div className="flex items-center gap-3">
              <Logo />
              <p className="text-sm text-lightmuted ">
                All rights reserved by MaterialM.
              </p>
            </div>
            <p className="text-sm text-lightmuted  flex items-center gap-1 md:pt-0 pt-3">
              Produced by{" "}
              <Link
                className="text-white text-primary-ld"
                href="https://www.wrappixel.com/"
              >
                Wrappixel
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
