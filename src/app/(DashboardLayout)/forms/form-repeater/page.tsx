import CourseRepeaterForm from "@/app/components/form-components/Form-Repeater/CourseRepeaterForm";
import DailyActivityRepeaterForm from "@/app/components/form-components/Form-Repeater/DailyActivityRepeaterForm";
import EcommRepeaterForm from "@/app/components/form-components/Form-Repeater/EcommRepeaterForm";
import EmployeeRepeaterForm from "@/app/components/form-components/Form-Repeater/EmployeeRepeaterForm";
import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Repeater",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Repeater",
  },
];

function page() {
  return (
    <>
      <BreadcrumbComp title="Form Repeater" items={BCrumb} />

      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* Basic */}
        <div className="col-span-12">
          <EcommRepeaterForm />
        </div>
        <div className="col-span-12">
          <CourseRepeaterForm />
        </div>
        <div className="col-span-12">
          <EmployeeRepeaterForm />
        </div>
        <div className="col-span-12">
          <DailyActivityRepeaterForm />
        </div>
      </div>
    </>
  );
}

export default page;
