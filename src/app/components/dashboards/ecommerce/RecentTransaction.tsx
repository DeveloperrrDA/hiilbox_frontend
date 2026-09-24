"use client";
import React from "react";
import CardBox from "../../shared/CardBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HiOutlineDotsVertical } from "react-icons/hi";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RecentTransaction = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];
  const RecentTransData = [
    {
      img: "/images/svgs/icon-paypal.svg",
      title: "PayPal Transfer",
      subtitle: "Money added",
      rank: "+$6,235",
      disable: "",
      bgcolor: "secondary",
    },
    {
      img: "/images/svgs/icon-office-bag.svg",
      title: "Wallet",
      subtitle: "Bill payment",
      rank: "+$345",
      disable: "opacity-80",
      bgcolor: "success",
    },
    {
      img: "/images/svgs/icon-master-card.svg",
      title: "Credit Card",
      subtitle: "Money reversed",
      rank: "+$2,235",
      disable: "",
      bgcolor: "warning",
    },
    {
      img: "/images/svgs/icon-money.svg",
      title: "Bank Transfer",
      subtitle: "Money added",
      rank: "+$320",
      disable: "opacity-80",
      bgcolor: "primary",
    },
    {
      img: "/images/svgs/icon-pie.svg",
      title: "Refund",
      subtitle: "Bill Payment",
      rank: "-$32",
      disable: "opacity-80",
      bgcolor: "error",
    },
  ];
  return (
    <>
      <CardBox className="h-full">
        <div className="flex items-center justify-between">
          <h5 className="card-title">Recent Transactions</h5>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                  <HiOutlineDotsVertical size={22} />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {dropdownItems.map((items, index) => {
                  return (
                    <DropdownMenuItem key={index}>{items}</DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-7">
          {RecentTransData.map((item, index) => (
            <div className="flex gap-3 items-center" key={index}>
              <div
                className={`h-10 w-10 rounded-md flex justify-center items-center bg-light${item.bgcolor} dark:bg-dark${item.bgcolor}`}
              >
                <Image src={item.img} alt="icon" width={24} height={24} />
              </div>
              <div>
                <h5 className="text-base">{item.title}</h5>
                <p className="text-sm text-darklink">{item.subtitle}</p>
              </div>
              <div className={`ms-auto font-medium text-ld ${item.disable}`}>
                {item.rank}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-ld mt-6">
          <Button color={"primary"} className="w-full mt-7">
            <Link href={'/frontend-pages/pricing'}>View All Transactions</Link>
          </Button>
        </div>
      </CardBox>
    </>
  );
};

export default RecentTransaction;
