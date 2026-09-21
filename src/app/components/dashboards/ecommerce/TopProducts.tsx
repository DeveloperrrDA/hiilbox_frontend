"use client";
import React from "react";
import CardBox from "../../shared/CardBox";

import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";

const TopProducts = () => {
  const dropdownItems = ["Action", "Another action", "Something else"];

  const TableData = [
    {
      imgBg: "primary",
      img: "/images/svgs/icon-materialM.svg",
      leadname: "MaterialM - Admin",
      subtext: "Dashboard Template",
      statustext: "Mobile",
      statuscolor: "lightPrimary",
      sales: "2,350",
      earnings: "$24,235",
      techicon: [
        {
          id: 1,
          icon: "/images/svgs/icon-photoshop.svg",
        },
      ],
    },
    {
      imgBg: "secondary",
      img: "/images/svgs/icon-matdash.svg",
      leadname: "MatDash - Admin",
      subtext: "Dashboard Template",
      statustext: "Web App",
      statuscolor: "lightSuccess",
      sales: "1,630",
      earnings: "$13,699",
      techicon: [
        {
          id: 1,
          icon: "/images/svgs/icon-figma.svg",
        },
        {
          id: 2,
          icon: "/images/svgs/icon-vue.svg",
        },
      ],
    },
    {
      imgBg: "success",
      img: "/images/svgs/icon-spike.svg",
      leadname: "Spike - Admin",
      subtext: "Dashboard Template",
      statustext: "Website",
      statuscolor: "lightSecondary",
      sales: "480",
      earnings: "$13,699",
      techicon: [
        {
          id: 1,
          icon: "/images/svgs/icon-xd.svg",
        },
        {
          id: 2,
          icon: "/images/svgs/icon-bootstrap.svg",
        },
      ],
    },
    {
      imgBg: "warning",
      img: "/images/svgs/icon-modernize.svg",
      leadname: "Modernize - Admin",
      subtext: "Dashboard Template",
      statustext: "Marketing",
      statuscolor: "lightSuccess",
      sales: "874",
      earnings: "$10,250",
      techicon: [
        {
          id: 1,
          icon: "/images/svgs/icon-angular.svg",
        },
      ],
    },
    {
      imgBg: "error",
      img: "/images/svgs/icon-materialpro.svg",
      leadname: "MaterialPro - Admin",
      subtext: "Dashboard Template",
      statustext: "SSM",
      statuscolor: "lightWarning",
      sales: "3715",
      earnings: "$36,400",
      techicon: [
        {
          id: 1,
          icon: "/images/svgs/icon-nextjs.svg",
        },
        {
          id: 2,
          icon: "/images/svgs/icon-javascript.svg",
        },
      ],
    },
  ];

  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <h5 className="card-title">Top Performing Products</h5>
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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-0 font-semibold text-sm  px-4 py-4 dark:bg-transparent ps-0">
                  Product Name
                </TableHead>
                <TableHead className="font-semibold px-4 py-4 dark:bg-transparent text-sm  ">
                  Category
                </TableHead>
                <TableHead className="font-semibold px-4 py-4 dark:bg-transparent text-sm  ">
                  Sales
                </TableHead>
                <TableHead className="font-semibold px-4 py-4 dark:bg-transparent text-sm  ">
                  Earnings
                </TableHead>
                <TableHead className="font-semibold px-4 py-4 dark:bg-transparent text-sm   pe-0 text-end">
                  Technology
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TableData.map((item, index) => (
                <TableRow key={index} className="border-0">
                  <TableCell className="whitespace-nowrap ps-0 px-4 py-3">
                    <div className="flex gap-3 items-center">
                      <div
                        className={`h-14 w-14 rounded-md flex justify-center items-center bg-light${item.imgBg} dark:bg-dark${item.imgBg}`}
                      >
                        <Image
                          src={item.img}
                          alt="icon"
                          width={30}
                          height={30}
                        />
                      </div>
                      <div className="text-ld text-[15px]">
                        <p>{item.leadname}</p>
                        <span>{item.subtext}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.statuscolor as any}>
                      {item.statustext}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-darklink">{item.sales}</TableCell>
                  <TableCell className="text-darklink">
                    {item.earnings}
                  </TableCell>
                  <TableCell className="pe-0 text-end">
                    <div className="flex gap-2 items-center justify-end">
                      {item.techicon.map((logo, i) => (
                        <Image
                          src={logo.icon}
                          alt="icon"
                          key={i}
                          width={24}
                          height={24}
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardBox>
    </>
  );
};

export default TopProducts;
