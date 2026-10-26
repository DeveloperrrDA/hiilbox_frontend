import React from "react";
import type { Metadata } from "next";
import ThemeShell from "@/components/theme/ThemeShell";
import ContactMap from "@/app/components/front-pages/contactus/ContactMap";
import ContactForm from "@/app/components/front-pages/contactus/ContactForm";
import MakeADifferenceCTA from "@/app/components/front-pages/MakeADifferenceCTA";
import FrontEndBreadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/FrontBreadcrumb";

export const metadata: Metadata = {
  title: "Front-Contact Us",
};
const page = () => {
  return (
    <>
      <ThemeShell>
        <div className="bg-lightgray dark:bg-darkgray">
          <FrontEndBreadcrumb
            title="Get in Touch with Hiilbox."
            link="Contact Us"
          />
          <div className="lg:pb-24 pb-12">
            <ContactMap />
            <ContactForm />
          </div>
          <MakeADifferenceCTA />
        </div>
      </ThemeShell>
    </>
  );
};

export default page;
