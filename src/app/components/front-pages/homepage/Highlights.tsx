"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";

export const Highlights = () => {
  const Categories = [
    {
      key: "feature1",
      icon: "tabler:mosque",
      title: "Masjid",
      description: "Faith-based causes",
      urlSlug: "masjid",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature2",
      icon: "tabler:mood-kid",
      title: "Orphans",
      description: "Care and protection",
      urlSlug: "orphans",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature3",
      icon: "tabler:heart-handshake",
      title: "Community",
      description: "Support local causes",
      urlSlug: "community",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature4",
      icon: "tabler:books",
      title: "Education",
      description: "Help students grow",
      urlSlug: "education",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature5",
      icon: "tabler:medical-cross",
      title: "Health",
      description: "Medical support",
      urlSlug: "health",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature6",
      icon: "tabler:droplet",
      title: "Water",
      description: "Clean water projects",
      urlSlug: "water",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature7",
      icon: "tabler:home-shield",
      title: "Shelter",
      description: "Homes and safety",
      urlSlug: "shelter",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature8",
      icon: "tabler:tools-kitchen-2",
      title: "Food Aid",
      description: "Meals for families",
      urlSlug: "food-aid",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature9",
      icon: "tabler:leaf",
      title: "Environment",
      description: "Faith-based causes",
      urlSlug: "environment",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
    {
      key: "feature10",
      icon: "tabler:moon",
      title: "Ramadan",
      description: "Protect the future",
      urlSlug: "ramadan",
      iconBg: "bg-lightprimary dark:bg-primary/20",
      iconColor: "text-primary dark:text-[#8BD3A8]",
    },
  ];
  
  return (
    <>
      <div className="dark:bg-dark">
        <div className="container-full mx-auto ">
          <div className=" lg:pt-24 pt-12 rounded-md overflow-hidden">
            <div className="flex w-full justify-center mb-12">
              <div className="text-center">
                <h2 className="sm:text-44 text-3xl font-bold leading-48px! text-dark dark:text-white text-center">
                  Explore Campaigns by <span className="text-primary">Category</span>
                </h2>
              </div>
            </div>
            <div className="marquee1-group flex gap-6 pb-6">
              {[0, 1, 2, 3].map((groupIndex) => {
                return (
                  <div key={`group-${groupIndex}`} className="flex gap-6 mb-6">
                    {Categories.map((item) => {
                      return (
                        <Link
                          href={`/campaigns?category=${item.urlSlug}`}
                          key={`${groupIndex}-${item.key}`}
                          className="group flex flex-col items-center gap-4 rounded-[20px] bg-white border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-800 dark:bg-darkgray w-48 shrink-0"
                        >
                          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.iconBg}`}>
                            <Icon
                              icon={item.icon}
                              className={`text-[32px] ${item.iconColor}`}
                            />
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <p className="text-[17px] font-bold text-[#0F1F17] dark:text-white mb-1">
                              {item.title}
                            </p>
                            <p className="text-[13px] font-medium text-[#687280] dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};