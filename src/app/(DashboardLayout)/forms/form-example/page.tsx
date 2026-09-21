import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import RegistrationForm from "@/app/components/form-components/Form-Example/RegistrationForm";
import StudentEnrollmentForm from "@/app/components/form-components/Form-Example/StudentEnrollmentForm";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Form Example",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Form Example",
  },
];

function page() {
  return (
    <>
      <BreadcrumbComp title="Form Example" items={BCrumb} />

      <div className="grid grid-cols-12 gap-7">
        <div className=" col-span-12">
          <RegistrationForm />
        </div>
        <div className=" col-span-12">
          <StudentEnrollmentForm />
        </div>
      </div>
    </>
  );
}

export default page;
