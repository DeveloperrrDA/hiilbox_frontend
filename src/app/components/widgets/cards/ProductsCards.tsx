"use client";
import Link from "next/link";
import CardBox from "../../shared/CardBox";
import Image from "next/image";
import { IconBasket } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import RatingStars from "../../shared/RatingStars";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "@/components/ui/card";

/*--Products Cards--*/
const productsCardData = [
  {
    title: "Boat Headphone",
    link: "/",
    photo: "/images/products/s2.jpg",
    salesPrice: 375,
    price: 285,
    rating: 4,
  },
  {
    title: "MacBook Air Pro",
    link: "/",
    photo: "/images/products/s5.jpg",
    salesPrice: 650,
    price: 900,
    rating: 5,
  },
  {
    title: "Red Valvet Dress",
    link: "/",
    photo: "/images/products/s8.jpg",
    salesPrice: 150,
    price: 200,
    rating: 3,
  },
  {
    title: "Cute Soft Teddybear",
    link: "/",
    photo: "/images/products/s11.jpg",
    salesPrice: 285,
    price: 345,
    rating: 2,
  },
];

const ProductsCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-7">
        {productsCardData.map((item, i) => (
          <div className="lg:col-span-3 md:col-span-6 col-span-12" key={i}>
            <Link href={item.link} className="group">
              <CardBox className="p-0 overflow-hidden">
                <div className="relative">
                  <Image
                    src={item.photo}
                    alt="materialm"
                    width={300}
                    height={300}
                  />
                </div>

                <div className="px-6 pb-6 relative">
                  <Button className="btn-circle ms-auto p-0 rounded-full! -mt-3 z-1">
                    <IconBasket size={15} />
                  </Button>

                  <h5 className="text-lg mb-1">{item.title}</h5>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h6 className="text-h6">${item.price}</h6>
                      <span className="text-sm font-medium line-through text-bodytext">
                        ${item.salesPrice}
                      </span>
                    </div>

                    <RatingStars rating={item.rating} />
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

export default ProductsCards;
