"use client";
import CardBox from "../../shared/CardBox";

import { HiOutlineDotsVertical } from "react-icons/hi";

import { Icon } from "@iconify/react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RatingStars from "../../shared/RatingStars";
import AnimatedInputPlaceholder from "../../animatedComponents/AnimatedInputPlaceholder";
import Link from "next/link";
const LatestReview = () => {
  /*Table Action*/
  const tableActionData = [
    {
      icon: "solar:add-circle-outline",
      listtitle: "Add",
    },
    {
      icon: "solar:pen-new-square-broken",
      listtitle: "Edit",
    },
    {
      icon: "solar:trash-bin-minimalistic-outline",
      listtitle: "Delete",
    },
  ];

  const LatestReviewData = [
    {
      profile: "/images/profile/user-2.jpg",
      customername: "Arlene McCoy",
      customeremail: "macoy@arlene.com",
      review: 5,
      reviewtext:
        "This theme is great. Clean and easy to understand. Perfect for those who don t havetime to",
      time: "Nov 8",
    },
    {
      profile: "/images/profile/user-3.jpg",
      customername: "Jerome Bell",
      customeremail: "belljerome@yahoo.com",
      review: 4,
      reviewtext:
        "It is a Mac, after all. Once you have gone Mac,there s no going back. My first Maclastedover nine years",
      time: "Nov 8",
    },
    {
      profile: "/images/profile/user-4.jpg",
      customername: "Jacob Jones",
      customeremail: "jones009@hotmail.com",
      review: 4,
      reviewtext:
        " The best experience we could hope for.Customer service team is amazing and thequality of their products",
      time: "Nov 8",
    },
    {
      profile: "/images/profile/user-5.jpg",
      customername: "Annette Black",
      customeremail: "blackanne@yahoo.com",
      review: 3,
      reviewtext:
        " The controller is quite comfy for me. Despiteits increased size, the controller still fits well",
      time: "Nov 8",
    },
  ];

  return (
    <>
      <CardBox className="px-0">
        <div className="sm:flex  items-center justify-between px-6">
          <div>
            <h5 className="card-title">Latest Reviews</h5>
            <p className="card-subtitle">
              Reviewed received across all channels
            </p>
          </div>

          <div className="flex gap-4 sm:mt-0 mt-3">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:magnifer-line-duotone" height={18} />
              </span>
              <Input
                type="text"
                placeholder="Search"
                required
                className="pl-10 form-control-rounded"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                  <HiOutlineDotsVertical size={22} />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tableActionData.map((items, index) => (
                  <DropdownMenuItem key={index} className="flex gap-3">
                    <Icon icon={`${items.icon}`} height={18} />
                    <span>{items.listtitle}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="text-center">
              <TableRow>
                <TableHead className="px-6 py-4  text-base font-semibold pb-2">
                  #
                </TableHead>
                <TableHead className="p-4 text-base font-semibold  pb-2">
                  Customer
                </TableHead>
                <TableHead className=" p-4  text-base font-semibold pb-2">
                  Reviews
                </TableHead>
                <TableHead className=" p-4   text-base font-semibold pb-2">
                  Time
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border dark:divide-darkborder ">
              {LatestReviewData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap ps-6">
                    <Checkbox className="checkbox" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap ps-6">
                    <div className="flex gap-3 items-center">
                      <Image
                        src={item.profile}
                        alt="icon"
                        className="h-8 w-8 rounded-full"
                        width={32}
                        height={32}
                      />
                      <div className="truncat line-clamp-2 text-wrap max-w-56">
                        <h6 className="text-base">{item.customername}</h6>
                        <p className="text-sm text-ld">{item.customeremail}</p>

                        {item.review == 5 ? (
                          <RatingStars rating={item.review} />
                        ) : item.review == 4 ? (
                          <RatingStars rating={item.review} />
                        ) : (
                          <RatingStars rating={item.review} />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <p className="text-ld truncat line-clamp-2 text-wrap max-w-56 text-sm">
                      {item.reviewtext}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <p className="text-ld text-sm">{item.time}</p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                          <HiOutlineDotsVertical size={22} />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {tableActionData.map((items, index) => (
                          <DropdownMenuItem key={index} className="flex gap-3">
                            <Icon icon={`${items.icon}`} height={18} />
                            <span>{items.listtitle}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="sm:flex items-center justify-between border-t border-ld pt-6 px-6">
          <span className="text-darklink text-sm">1-6 of 32</span>
          <Button color={"primary"} className="w-fit">
            View All Reviews
          </Button>
        </div>
      </CardBox>
    </>
  );
};

export default LatestReview;
