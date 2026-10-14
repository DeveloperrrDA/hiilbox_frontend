import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import ChartLineDefaultCode from "@/app/components/shadcn-charts/line/code/DefaultCode";
import ChartLineLinearCode from "@/app/components/shadcn-charts/line/code/LinearCode";
import ChartLineStepCode from "@/app/components/shadcn-charts/line/code/StepCode";
import ChartLineMultipleCode from "@/app/components/shadcn-charts/line/code/MultipleCode";
import ChartLineDotsCode from "@/app/components/shadcn-charts/line/code/DotsCode";
import ChartLineDotsCustomCode from "@/app/components/shadcn-charts/line/code/CustomDotsCode";
import ChartLineDotsColorsCode from "@/app/components/shadcn-charts/line/code/DotsColorsCode";
import ChartLineLabelCode from "@/app/components/shadcn-charts/line/code/LabelCode";
import ChartLineLabelCustomCode from "@/app/components/shadcn-charts/line/code/CustomLabelCode";
import ChartLineInteractiveCode from "@/app/components/shadcn-charts/line/code/InteractiveCode";

export const metadata: Metadata = {
  title: "Line Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Create smooth line charts and trend graphs with Shadcn UI components built with Tailwind React for dashboard time-series visualization.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Line Chart",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Line Chart" items={BCrumb} />

      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* intro */}
        {/* <div className='col-span-12'>
          <Intro detail={intro} />
        </div> */}
        {/* Default */}
        <div className="col-span-12">
          <ChartLineDefaultCode />
        </div>
        {/* Linear */}
        <div className="col-span-12">
          <ChartLineLinearCode />
        </div>
        {/* Step */}
        <div className="col-span-12">
          <ChartLineStepCode />
        </div>
        {/* Multiple */}
        <div className="col-span-12">
          <ChartLineMultipleCode />
        </div>
        {/* Dots */}
        <div className="col-span-12">
          <ChartLineDotsCode />
        </div>
        {/* Custom Dots */}
        <div className="col-span-12">
          <ChartLineDotsCustomCode />
        </div>
        {/* Dots Colors */}
        <div className="col-span-12">
          <ChartLineDotsColorsCode />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartLineLabelCode />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartLineLabelCustomCode />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartLineInteractiveCode />
        </div>
      </div>
    </>
  );
};

export default page;
