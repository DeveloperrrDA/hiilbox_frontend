import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import ChartAreaDefaultCode from "@/app/components/shadcn-charts/area/code/DefaultCode";
import ChartAreaLinearCode from "@/app/components/shadcn-charts/area/code/LinearCode";
import ChartAreaStepCode from "@/app/components/shadcn-charts/area/code/StepCode";
import ChartAreaLegendCode from "@/app/components/shadcn-charts/area/code/LegendCode";
import ChartAreaStackedCode from "@/app/components/shadcn-charts/area/code/StackedCode";
import ChartAreaStackedExpandCode from "@/app/components/shadcn-charts/area/code/StackedExpandedCode";
import ChartAreaIconsCode from "@/app/components/shadcn-charts/area/code/IconsCode";
import ChartAreaGradientCode from "@/app/components/shadcn-charts/area/code/GradientCode";
import ChartAreaAxesCode from "@/app/components/shadcn-charts/area/code/AxesCode";
import ChartAreaInteractiveCode from "@/app/components/shadcn-charts/area/code/InteractiveCode";

export const metadata: Metadata = {
  title: "Area Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Create responsive area charts and filled line graphs with Shadcn UI components built with Tailwind React for dashboard data visualization.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Area Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Area Chart" items={BCrumb} />

      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* intro */}
        {/* <div className='col-span-12'>
          <Intro detail={intro} />
        </div> */}
        {/* default */}
        <div className="col-span-12">
          <ChartAreaDefaultCode />
        </div>
        {/* Linear */}
        <div className="col-span-12">
          <ChartAreaLinearCode />
        </div>
        {/* Step */}
        <div className="col-span-12">
          <ChartAreaStepCode />
        </div>
        {/* Legend */}
        <div className="col-span-12">
          <ChartAreaLegendCode />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartAreaStackedCode />
        </div>
        {/* Stacked expanded */}
        <div className="col-span-12">
          <ChartAreaStackedExpandCode />
        </div>
        {/* Icons */}
        <div className="col-span-12">
          <ChartAreaIconsCode />
        </div>
        {/* Gradient */}
        <div className="col-span-12">
          <ChartAreaGradientCode />
        </div>
        {/* Axes */}
        <div className="col-span-12">
          <ChartAreaAxesCode />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartAreaInteractiveCode />
        </div>
      </div>
    </>
  );
};

export default page;
