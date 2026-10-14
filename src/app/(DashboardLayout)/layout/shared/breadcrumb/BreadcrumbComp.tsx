"use client";
import CardBox from "@/app/components/shared/CardBox";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

import { JSX } from "react";

interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
  children?: JSX.Element;
}

const BreadcrumbComp = ({ title, items }: BreadCrumbType) => {
  return (
    <>
      <CardBox className={`mb-[30px]`}>
        <div className="flex justify-between">
          <h6 className="text-base">{title}</h6>

          <Breadcrumb className="flex items-center gap-3 ms-auto">
            <BreadcrumbList>
              {items
                ? items.map((item: any) => (
                    <BreadcrumbItem key={item.title}>
                      {item.to ? (
                        <BreadcrumbLink asChild>
                          <Link href={item.to}>
                            <div className="flex items-center gap-1">
                              <Icon
                                icon="solar:home-2-line-duotone"
                                height={20}
                              />
                              <span className="ms-3 text-gray-700 dark:text-gray-400">
                                /
                              </span>
                            </div>
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <Badge variant="lightPrimary" className="px-2.5 py-1">
                          {item.title}
                        </Badge>
                      )}
                    </BreadcrumbItem>
                  ))
                : ""}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </CardBox>
    </>
  );
};

export default BreadcrumbComp;
