import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MainBanner = () => {
  
  return (
    <>
      <div className="bg-lightgray dark:bg-darkgray">
        <div className="container-1218 mx-auto sm:pt-10 pt-6 xl:pb-6 pb-10">
          <div className="grid grid-cols-12 gap-7 items-center py-20">
            <div className="hiilbox-hero-enter xl:col-span-6 col-span-12 lg:text-start text-center">
              <div className="flex justify-self-start rounded-full text-primary bg-primary/10 px-5 py-2.5 gap-1 mb-5">
                <Icon
                  icon="material-symbols:shield-outline-rounded"
                  height={22}
                  className="text-primary"
                />
                <h1 className="text-20 font-bold text-inherit">
                  Somali Crowdfunding Platform
                </h1>
                
              </div>
              <h1 className="lg:text-56 text-4xl text-dark dark:text-white font-bold lg:leading-64px leading-50px">
                A Trusted Way<b className="font-bold text-primary"> to </b> <b className="block">Raise Funds</b> 
                <b className="text-primary">Online | Hiilbox</b>
              </h1>
              <div className="sm:flex mx-auto block items-center gap-3 lg:justify-start justify-center py-6">
                
                <h5 className="text-base text-ld font-medium opacity-80 md:pt-0 pt-3">
                  A transparent crowdfunding platform that lets people help each other and create meaningful impact through secure and transparent donations.
                </h5>
              </div>
              <div className="flex lg:justify-start justify-center">
                <Button
                  className="font-bold sm:w-fit w-full rounded-full bg-primary hover:bg-primary/80"
                  size="lg"
                >
                  <Link href="/auth/auth2/login">Start Fundraising Now</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6 col-span-12 xl:block hidden">
              <div className=" overflow-hidden ">
                <Image
                  src="https://cdn.hiilbox.com/2026/06/A-Trusted-Way-to-Raise-Funds-Online-Hiilbox.webp"
                  className="rtl:scale-x-[-1] rounded-[20px]"
                  alt="banner"
                  loading="eager"
                  width={1144}
                  height={710}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainBanner;
