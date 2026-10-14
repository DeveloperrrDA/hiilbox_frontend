"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
const Feature = [
  {
    icon: "tabler:rocket",
    number: "10",
    title: "Active Campaigns",
    subtitle: "Campaigns currently making a difference in people’s lives.",
    bgcolor: "bg-lightprimary",
    color: "text-primary",
  },
  {
    icon: "tabler:coin",
    number: "120K",
    title: "Funds Raised",
    subtitle: "Total funds raised to support causes that matter.",
    bgcolor: "bg-lightprimary",
    color: "text-primary",
  },
  {
    icon: "tabler:users",
    number: "400",
    title: "Donors",
    subtitle: "Generous people supporting change and creating impact.",
    bgcolor: "bg-lightprimary",
    color: "text-primary",
  },
];

const OurClients = () => {
  return (
    <>
      <div className="bg-lightgray dark:bg-darkgray lg:py-24 py-12 dark:bg-dark">
        <div className="container-1218 mx-auto">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col items-center basis-full">
              <h2 className="sm:text-44 text-3xl font-bold leading-48px! text-darkgray dark:text-white text-center">
                Together, We Build <span className="text-primary">Stronger Communities</span>
              </h2>
              <p className="text-base leading-8 text-darklink  opacity-80 py-6">
                Hiilbox is your trusted home for Somali crowdfunding, connecting everyday donors and changemakers to create real, lasting impact.
              </p>
              <Link
                href={"/"}
                className="text-darkgray dark:text-white text-sm font-bold underline decoration-2 underline-offset-[6px] text-primary-ld"
              >
                Request a Callback
              </Link>
            </div>
            <div className="flex pt-10">
              <div className="grid grid-cols-12 justify-items-center md:gap-12 gap-6">
                {Feature.map((item, index) => (
                  <div className="md:col-span-4 col-span-12" justify-items-center key={index}>
                    <div
                      className={`h-12 w-12 shrink-0 flex items-center justify-center justify-self-center rounded-xl ${item.bgcolor}`}
                    >
                      <Icon
                        icon={item.icon}
                        className={`${item.color}`}
                        height={24}
                      />
                    </div>
                    <p className="font-light text-darkgray justify-self-center dark:text-white pt-5 text-xl">
                      {item.number}
                    </p>
                    <h4 className="font-bold text-darkgray justify-self-center dark:text-white  text-xl">
                      {item.title}
                    </h4>
                    <p className="text-base text-darklink justify-self-center text-center md:pt-2 leading-6">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurClients;
