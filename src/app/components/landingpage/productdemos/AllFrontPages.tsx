import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FrontMenu } from "../Data";
const AllFrontPages = () => {
  return (
    <>
      {/* Demos */}
      <div className="grid grid-cols-12 gap-[30px]">
        {FrontMenu.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className="lg:col-span-4 md:col-span-6 col-span-12 "
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1000"
            >
              <div className="relative overflow-hidden rounded-md border border-ld ">
                <div className="overflow-hidden rounded-md rounded-b-none relative flex justify-center items-center group ">
                  <Image
                    src={item.img}
                    alt="materialm"
                    className="w-full"
                    width={862}
                    height={623}
                  />
                </div>
                <div className="rounded-t-none rounded-md p-4 flex justify-between items-center">
                  <div>
                    <Link
                      href={item.link}
                      className="text-base text-dark dark:text-white hover:text-primary font-semibold"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm">{item.include}</p>
                  </div>

                  <Button className="text-xs">
                    <Link href={item.link}>Live Preview</Link>
                  </Button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default AllFrontPages;
