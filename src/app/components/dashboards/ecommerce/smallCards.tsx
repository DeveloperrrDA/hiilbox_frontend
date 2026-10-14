"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import CardBox from "../../shared/CardBox";

const SmallCard = [
  {
    icon: "solar:pie-chart-2-broken",
    num: "2358",
    percent: "+23%",
    title: "Sales",
    shape: "/images/shapes/danger-card-shape.png",
    bgcolor: "error",
  },
  {
    icon: "solar:refresh-circle-line-duotone",
    num: "434",
    percent: "-12%",
    title: "Refunds",
    shape: "/images/shapes/secondary-card-shape.png",
    bgcolor: "secondary",
  },
  {
    icon: "solar:dollar-minimalistic-linear",
    num: "$245k",
    percent: "+8%",
    title: "Earnings",
    shape: "/images/shapes/success-card-shape.png",
    bgcolor: "success",
  },
];

const SmallCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-7">
        {SmallCard.map((theme, index) => (
          <div className="md:col-span-4 col-span-12" key={index}>
            <CardBox
              className={`relative !shadow-none rounded-lg  overflow-hidden bg-light${theme.bgcolor} dark:bg-dark${theme.bgcolor}`}
            >
              {/* <div
              className={`relative shadow-none rounded-lg p-6 overflow-hidden bg-light${theme.bgcolor} dark:bg-dark${theme.bgcolor}`}
            > */}
              <div>
                <Image
                  src={theme.shape}
                  alt="shape"
                  className="absolute end-0 top-0"
                  width={100}
                  height={100}
                />
                <span
                  className={`w-14 h-10 rounded-full flex items-center justify-center text-white mb-8  bg-${theme.bgcolor}`}
                >
                  <Icon icon={theme.icon} height={24} />
                </span>
                <div className="flex items-center gap-1">
                  <h5 className="text-lg">{theme.num}</h5>
                  <span className="font-semibold border rounded-full border-black/5 dark:border-white/10 py-0.5 px-[10px] leading-[normal] text-xs">
                    {theme.percent}
                  </span>
                </div>
                <p className="text-darklink text-sm mt-2 font-medium">
                  {theme.title}
                </p>
              </div>
              {/* </div> */}
            </CardBox>
          </div>
        ))}
      </div>
    </>
  );
};

export default SmallCards;
