"use client";
import Slider from "react-slick";
import * as ClientRev from "../Data";
import React from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Icon } from "@iconify/react/dist/iconify.js";

const ClientReviews = () => {
  const renderStars = (rating: number) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <Icon
          key={i}
          icon={i <= rating ? "solar:star-bold" : "solar:star-linear"}
          className={`w-7 h-7 ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const NextArrow = ({ onClick }: any) => {
    return (
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10  cursor-pointer  inline-flex sm:h-10 sm:w-10 h-0 w-0 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white  group-hover:bg-primary group-focus:outline-none group-focus:ring-0"
        onClick={onClick}
      >
        <Icon icon="solar:alt-arrow-right-line-duotone" className="w-6 h-6" />
      </div>
    );
  };

  const PrevArrow = ({ onClick }: any) => {
    return (
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer inline-flex sm:h-10 sm:w-10 h-0 w-0 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white  group-hover:bg-primary group-focus:outline-none group-focus:ring-0"
        onClick={onClick}
      >
        <Icon icon="solar:alt-arrow-left-linear" className="w-6 h-6 " />
      </div>
    );
  };

  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 1,
    swipeToSlide: true,
    dots: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="bg-white dark:bg-dark">
        <div className="container md:py-20 py-12 !text-center">
          <div
            className="h-96 xl:min-h-64 xl:h-80 2xl:h-96 slider-container client-reviews"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="1000"
          >
            <Slider {...settings}>
              {ClientRev.userReview.map((item, index) => (
                <div key={index} className="max-w-[900px]  ">
                  <div className="mx-auto flex justify-center mb-4">
                    {renderStars(item.rating)}
                  </div>
                  <h2 className="md:text-4xl text-2xl pb-8 font-medium ">
                    {item.review}
                  </h2>
                  <div className="flex gap-3.5 items-center justify-center">
                    <div>
                      <Image
                        src={item.img}
                        alt="review"
                        className="rounded-full h-14 w-14"
                        width={56}
                        height={56}
                      />
                    </div>
                    <div>
                      <h5 className="text-lg text-left">{item.title}</h5>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientReviews;
