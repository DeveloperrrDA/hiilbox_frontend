"use client";
import { Icon } from "@iconify/react";
export const Highlights = () => {
  const Categories = [
    {
      key: "feature1",
      icon: "tabler:mosque",
      title: "Masjid",
      description: "Faith-based causes",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature2",
      icon: "tabler:mood-kid",
      title: "Orphans",
      description: "Care and protection",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature3",
      icon: "tabler:heart-handshake",
      title: "Community",
      description: "Support local causes",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature4",
      icon: "tabler:books",
      title: "Education",
      description: "Help students grow",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature5",
      icon: "tabler:medical-cross",
      title: "Health",
      description: "Medical support",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature6",
      icon: "tabler:droplet",
      title: "Water",
      description: "Clean water projects",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature7",
      icon: "tabler:home-shield",
      title: "Shelter",
      description: "Homes and safety",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature8",
      icon: "tabler:tools-kitchen-2",
      title: "Food Aid",
      description: "Meals for families",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature9",
      icon: "tabler:leaf",
      title: "Environment",
      description: "Faith-based causes",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "feature10",
      icon: "tabler:moon",
      title: "Ramadan",
      description: "Protect the future",
      bg: "bg-lightprimary",
      text: "text-primary",
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
            <div className="marquee1-group flex gap-6">
              {[0, 1, 2, 3].map((item,index) => {
                return (
                  <div key={index} className="flex gap-6 mb-6">
                    {Categories.map((item) => {
                      return (
                        <div
                          key={item.key}
                          className={`py-5 px-8 rounded-16px flex flex-col gap-3 items-center ${item.bg}`}
                        >
                          <Icon
                            icon={item.icon}
                            className={`text-4xl shrink-0 ${item.text}`}
                          />
                          <div className="flex flex-col items-center">
                            <p
                              className={`text-base font-semibold whitespace-nowrap ${item.text}`}
                            >
                              {item.title}
                            </p>
                            <p
                              className={`text-sm font-normal whitespace-nowrap`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
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
