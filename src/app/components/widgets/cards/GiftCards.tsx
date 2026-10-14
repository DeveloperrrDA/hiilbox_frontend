"use client";
import { Button } from "@/components/ui/button";
import CardBox from "../../shared/CardBox";
import { IconGift } from "@tabler/icons-react";
import Image from "next/image";

const GiftCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-7">
        <div className="sm:col-span-6 col-span-12">
          <CardBox>
            <div className="flex items-center justify-between">
              <h5 className="card-title">Andrew Grant</h5>
              <IconGift className="text-primary" size={20} />
            </div>
            <Image src={"/images/products/s1.jpg"} alt="maaterialm" width={310} height={150} className="rounded-lg w-full object-cover h-[150px]" />
            <Button className="mt-4">Gift to Friend ($50.00)</Button>
          </CardBox>
        </div>
        <div className="sm:col-span-6 col-span-12">
          <CardBox>
            <div className="flex items-center justify-between">
              <h5 className="card-title">Leo Pratt </h5>
              <IconGift className="text-primary" size={20} />
            </div>
            <Image src={"/images/products/s2.jpg"} alt="maaterialm" width={310} height={150} className="rounded-lg w-full object-cover h-[150px]"  />
            <Button className="mt-4">Gift to Friend ($50.00)</Button>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default GiftCards;
