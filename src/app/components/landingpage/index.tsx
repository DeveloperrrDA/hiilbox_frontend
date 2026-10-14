"use client";
import React, { useEffect } from "react";

import LpHeader from "@/app/components/landingpage/header/Header";

import LpBanners from "@/app/components/landingpage/banner/banner";
import ProductDemos from "@/app/components/landingpage/productdemos/demos";
import AllFeatures from "@/app/components/landingpage/features/AllFeatures";
import ClientReviews from "@/app/components/landingpage/reviews/ClientReviews";
import Ticket from "@/app/components/landingpage/ticket/Ticket";
import Footer from "@/app/components/landingpage/footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
const Landingpage = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <div className="landingpage overflow-x-hidden">
        <LpHeader />
        <LpBanners />
        <ProductDemos />
        <AllFeatures />
        <ClientReviews />
        <Ticket />
        <Footer />
      </div>
    </>
  );
};

export default Landingpage;
