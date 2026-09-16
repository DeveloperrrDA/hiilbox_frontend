"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FeatureTabs = () => {
  // Custom Tab
  const [activeTab, setActiveTab] = useState("Team Scheduling");
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const Tab1 = [
    {
      title: "Combine teammate schedules",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Factor in outside colleagues",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Round robin pooling",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
  ];

  const Tab2 = [
    {
      title: "Combine teammate schedules 2",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Factor in outside colleagues",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Round robin pooling",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
  ];

  const Tab3 = [
    {
      title: "Combine teammate schedules 3",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Factor in outside colleagues",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Round robin pooling",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
  ];

  const Tab4 = [
    {
      title: "Combine teammate schedules 4",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Factor in outside colleagues",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
    {
      title: "Round robin pooling",
      desc: "Factor in availability for required attendees, and skip checking for conflicts for optional attendees.",
    },
  ];

  return (
    <>
      <div className="bg-lightgray dark:bg-darkgray lg:py-24 py-12">
        <div className="container-1218 mx-auto">
          {/* Tabs */}
          <div className="overflow-x-auto ">
            <div className="flex Separatorink-0 gap-4 md:pb-14 pb-8">
              <div
                onClick={() => handleTabClick("Team Scheduling")}
                className={` py-4 px-6 whitespace-nowrap w-full rounded-xl cursor-pointer text-dark text-base font-semibold text-center flex gap-2 justify-center items-center  md:hover:bg-lightprimary md:dark:hover:bg-lightprimary md:hover:text-primary shadow-elevation2 ${
                  activeTab == "Team Scheduling"
                    ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                    : "dark:text-white bg-white dark:bg-dark"
                }`}
              >
                <Icon
                  icon="material-symbols:groups-outline-rounded"
                  height={22}
                />
                Team Scheduling
              </div>
              <div
                onClick={() => handleTabClick("Payments")}
                className={`py-4 px-6 whitespace-nowrap w-full rounded-xl cursor-pointer text-dark text-base font-semibold text-center flex gap-2 justify-center items-center  md:hover:bg-lightprimary md:dark:hover:bg-lightprimary md:hover:text-primary shadow-elevation2 ${
                  activeTab == "Payments"
                    ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                    : "dark:text-white bg-white dark:bg-dark"
                }`}
              >
                <Icon
                  icon="material-symbols:account-balance-outline"
                  height={22}
                />{" "}
                Payments
              </div>
              <div
                onClick={() => handleTabClick("Embedding")}
                className={`py-4 px-6 whitespace-nowrap w-full rounded-xl cursor-pointer text-dark text-base font-semibold text-center flex gap-2 justify-center items-center   md:hover:bg-lightprimary md:dark:hover:bg-lightprimary md:hover:text-primary shadow-elevation2 ${
                  activeTab == "Embedding"
                    ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                    : "dark:text-white bg-white dark:bg-dark"
                }`}
              >
                <Icon
                  icon="material-symbols-light:photo-frame-outline-sharp"
                  height={22}
                />{" "}
                Embedding
              </div>
              <div
                onClick={() => handleTabClick("Workflows")}
                className={`py-4 px-6 whitespace-nowrap w-full rounded-xl cursor-pointer text-dark text-base font-semibold text-center flex gap-2 justify-center items-center  md:hover:bg-lightprimary md:dark:hover:bg-lightprimary md:hover:text-primary shadow-elevation2  ${
                  activeTab == "Workflows"
                    ? "text-white bg-primary dark:bg-primary shadow-elevation3"
                    : "dark:text-white bg-white dark:bg-dark"
                }`}
              >
                <Icon
                  icon="material-symbols:widgets-outline-rounded"
                  height={22}
                />{" "}
                Workflows
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-7">
            {/* Tabs Content */}
            {activeTab === "Team Scheduling" && (
              <>
                <div className="lg:col-span-6 col-span-12">
                  <Image
                    src="/images/front-pages/background/feature-image.png"
                    className="w-full"
                    alt="banner"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="lg:col-span-6 col-span-12 lg:ps-7">
                  <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white pb-6">
                    Protect your focus.
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="shadow-none dark:shadow-none divide-y-0 !rounded-none"
                  >
                    {Tab1.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="focus:ring-0 px-0 text-base font-semibold text-ld py-5">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pt-0 !rounded-none">
                          <p className="text-base text-darklink leading-7 ">
                            {item.desc}
                          </p>
                        </AccordionContent>
                        <Separator className="my-0" />
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button className="font-bold mt-6">Learn More</Button>
                </div>
              </>
            )}
            {activeTab === "Payments" && (
              <>
                <div className="lg:col-span-6 col-span-12">
                  <Image
                    src="/images/front-pages/background/widget_materialM_2.png"
                    className="w-full"
                    alt="banner"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="lg:col-span-6 col-span-12 lg:ps-7">
                  <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white pb-6">
                    Protect your focus.
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="shadow-none dark:shadow-none divide-y-0 !rounded-none"
                  >
                    {Tab2.map((item, i) => (
                      <AccordionItem value={`item-${i}`} key={i}>
                        <AccordionTrigger className="focus:ring-0 px-0 text-base font-semibold text-ld py-5 ">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pt-0 !rounded-none">
                          <p className="text-base text-darklink leading-7 ">
                            {item.desc}
                          </p>
                        </AccordionContent>
                        <Separator className="my-0" />
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button color={"primary"} className="font-bold mt-6">
                    Learn More
                  </Button>
                </div>
              </>
            )}
            {activeTab === "Embedding" && (
              <>
                <div className="lg:col-span-6 col-span-12">
                  <Image
                    src="/images/front-pages/background/widget_materialM_3.png"
                    className="w-full"
                    alt="banner"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="lg:col-span-6 col-span-12 lg:ps-7">
                  <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white pb-6">
                    Protect your focus.
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="shadow-none dark:shadow-none divide-y-0 !rounded-none"
                  >
                    {Tab3.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="focus:ring-0 px-0 text-base font-semibold text-ld py-5 ">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pt-0 !rounded-none">
                          <p className="text-base text-darklink leading-7 ">
                            {item.desc}
                          </p>
                        </AccordionContent>
                        <Separator className="my-0" />
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button color={"primary"} className="font-bold mt-6">
                    Learn More
                  </Button>
                </div>
              </>
            )}
            {activeTab === "Workflows" && (
              <>
                <div className="lg:col-span-6 col-span-12">
                  <Image
                    src="/images/front-pages/background/widget_materialM_4.png"
                    className="w-full"
                    alt="banner"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="lg:col-span-6 col-span-12 lg:ps-7">
                  <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white pb-6">
                    Protect your focus.
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="shadow-none dark:shadow-none divide-y-0 !rounded-none"
                  >
                    {Tab4.map((item, i) => (
                      <AccordionItem value={`item-${i}`} key={i}>
                        <AccordionTrigger className="focus:ring-0 px-0 text-base font-semibold text-ld py-5 ">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pt-0 !rounded-none">
                          <p className="text-base text-darklink leading-7 ">
                            {item.desc}
                          </p>
                        </AccordionContent>
                        <Separator className="my-0" />
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button color={"primary"} className="font-bold mt-6">
                    Learn More
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureTabs;
