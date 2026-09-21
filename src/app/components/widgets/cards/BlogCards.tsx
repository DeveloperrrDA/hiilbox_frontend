"use client";
import CardBox from "../../shared/CardBox";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"; // ⬅️ shadcn badge
import { IconEye, IconMessage2, IconPoint } from "@tabler/icons-react";
import Link from "next/link";

const BlogCardsData = [
  {
    avatar: "/images/profile/user-6.jpg",
    coveravatar: "/images/blog/blog-img1.jpg",
    read: "2 min Read",
    title: "As yen tumbles, gadget-loving Japan goes for secondhand iPhones",
    category: "Social",
    name: "Georgeanna Ramero",
    view: "9,125",
    comments: "3",
    time: "Mon, Dec 19",
    url: "",
  },
  {
    avatar: "/images/profile/user-2.jpg",
    coveravatar: "/images/blog/blog-img2.jpg",
    read: "2 min Read",
    title:
      "Intel loses bid to revive antitrust case against patent foe Fortress",
    category: "Gadget",
    name: "Georgeanna Ramero",
    view: "4,150",
    comments: "38",
    time: "Sun, Dec 18",
    url: "",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    coveravatar: "/images/blog/blog-img3.jpg",
    read: "2 min Read",
    title: "COVID outbreak deepens as more lockdowns loom in China",
    category: "Health",
    name: "Georgeanna Ramero",
    view: "9,480",
    comments: "12",
    time: "Sat, Dec 17",
    url: "",
  },
];

const BlogCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-7 mt-7">
        {BlogCardsData.map((item, i) => (
          <div className="lg:col-span-4 col-span-12" key={i}>
            <Link href={item.url} className="group">
              <CardBox className="p-0 overflow-hidden ">
                <div className="relative">
                  <Image
                    src={item.coveravatar}
                    alt="materialm"
                    width={700}
                    height={600}
                  />

                  {/* shadcn badge */}
                  <Badge className="absolute bottom-5 end-5 font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {item.read}
                  </Badge>
                </div>

                <div className="px-6 pb-6">
                  <Image
                    src={item.avatar}
                    className="h-10 w-10 rounded-full -mt-7 relative z-1"
                    alt="user"
                    width={40}
                    height={40}
                  />

                  {/* shadcn badge */}
                  <Badge className="mt-6 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {item.category}
                  </Badge>

                  <h5 className="text-lg my-6 group-hover:text-primary">
                    {item.title}
                  </h5>

                  <div className="flex">
                    <div className="flex gap-2 me-6 items-center">
                      <IconEye
                        size={17}
                        className="text-dark dark:text-white"
                      />{" "}
                      <span className="text-sm text-bodytext">{item.view}</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <IconMessage2
                        size={17}
                        className="text-dark dark:text-white"
                      />{" "}
                      <span className="text-sm text-bodytext">{item.view}</span>
                    </div>

                    <div className="flex gap-1 items-center ms-auto">
                      <IconPoint
                        size={10}
                        className="text-dark dark:text-white"
                      />{" "}
                      <span className="text-sm text-bodytext">{item.time}</span>
                    </div>
                  </div>
                </div>
              </CardBox>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogCards;
