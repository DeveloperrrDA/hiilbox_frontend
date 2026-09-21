"use client";
import React from "react";
import CardBox from "../../shared/CardBox";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import Image from "next/image";
import SimpleBar from "simplebar-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PopularProducts = () => {
  const ProductTableData = [
    {
      img: "/images/products/s1.jpg",
      name: "iPhone 13 pro max-Pacific Blue-128GB storage",
      payment: "$180",
      paymentstatus: "Partially paid",
      process: 45,
      processcolor: "warning",
      statuscolor: "lightSecondary",
      statustext: "Confirmed",
    },
    {
      img: "/images/products/s2.jpg",
      name: "Apple MacBook Pro 13 inch-M1-8/256GB-space",
      payment: "$120",
      paymentstatus: "Full paid",
      process: 100,
      processcolor: "success",
      statuscolor: "lightSuccess",
      statustext: "Confirmed",
    },
    {
      img: "/images/products/s3.jpg",
      name: "PlayStation 5 DualSense Wireless Controller",
      payment: "$120",
      paymentstatus: "Cancelled",
      process: 100,
      processcolor: "error",
      statuscolor: "lightError",
      statustext: "Cancelled",
    },
    {
      img: "/images/products/s5.jpg",
      name: "Amazon Basics Mesh, Mid-Back, Swivel Office",
      payment: "$120",
      paymentstatus: "Partially paid",
      process: 45,
      processcolor: "warning",
      statuscolor: "lightSecondary",
      statustext: "Confirmed",
    },
    {
      img: "/images/products/s4.jpg",
      name: "Sony X85J 75 Inch Sony 4K Ultra HD LED Smart",
      payment: "$120",
      paymentstatus: "Full paid",
      process: 100,
      processcolor: "success",
      statuscolor: "lightSuccess",
      statustext: "Confirmed",
    },
  ];

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

  return (
    <>
      <CardBox className="px-0">
        <div className="px-6">
          <h5 className="card-title">Popular Products</h5>
          <p className="card-subtitle">Total 9k Visitors</p>
        </div>
        <SimpleBar className="max-h-[450px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-6 text-sm">Products</TableHead>
                  <TableHead className=" text-sm">Payment</TableHead>
                  <TableHead className=" text-sm">Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-border dark:divide-darkborder ">
                {ProductTableData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap ps-6">
                      <div className="flex gap-3 items-center">
                        <Image
                          src={item.img}
                          alt="icon"
                          className="h-[60px] w-[60px] rounded-lg"
                          width={60}
                          height={60}
                        />
                        <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                          <h6 className="text-sm">{item.name}</h6>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <h5 className="text-base text-wrap">
                        {item.payment}
                        <span className="text-ld opacity-70">
                          <span className="mx-1">/</span>499
                        </span>
                      </h5>
                      <div className="text-sm font-medium text-ld opacity-70 mb-2 text-wrap">
                        {item.paymentstatus}
                      </div>
                      <div className="me-5">
                        <Progress
                          value={item.process}
                          variant={`${
                            item.processcolor as
                              | "warning"
                              | "secondary"
                              | "error"
                              | "default"
                              | "primary"
                              | "info"
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={`${item.statuscolor}` as any}>
                        {item.statustext}
                      </Badge>
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
                            <DropdownMenuItem
                              key={index}
                              className="flex gap-3"
                            >
                              {" "}
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
        </SimpleBar>
      </CardBox>
    </>
  );
};

export default PopularProducts;
