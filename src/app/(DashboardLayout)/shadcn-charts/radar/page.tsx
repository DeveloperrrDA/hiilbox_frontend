import ChartRadarGridFill from "@/app/components/shadcn-charts/radar/GridFilled";
import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import ChartRadarDefaultCode from "@/app/components/shadcn-charts/radar/code/DefaultCode";
import ChartRadarDotsCode from "@/app/components/shadcn-charts/radar/code/DotsCode";
import ChartRadarLinesOnlyCode from "@/app/components/shadcn-charts/radar/code/LinesOnlyCode";
import ChartRadarLabelCustomCode from "@/app/components/shadcn-charts/radar/code/CustomLabelCode";
import ChartRadarGridCustomCode from "@/app/components/shadcn-charts/radar/code/GridCustomCode";
import ChartRadarGridNoneCode from "@/app/components/shadcn-charts/radar/code/GridNoneCode";
import ChartRadarGridCircleCode from "@/app/components/shadcn-charts/radar/code/GridCircleCode";
import ChartRadarGridCircleNoLinesCode from "@/app/components/shadcn-charts/radar/code/GridCircleNoLinesCode";
import ChartRadarGridCircleFillCode from "@/app/components/shadcn-charts/radar/code/GridCircleFilledCode";
import ChartRadarGridFillCode from "@/app/components/shadcn-charts/radar/code/GridFilledCode";
import ChartRadarLegendCode from "@/app/components/shadcn-charts/radar/code/LegendCode";
import ChartRadarMultipleCode from "@/app/components/shadcn-charts/radar/code/MultipleCode";

export const metadata: Metadata = {
  title: "Radar Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Create radar charts and spider web graphs with Shadcn UI components built with Tailwind React for dashboard multi-dimensional comparison.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Radar Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Radar Chart" items={BCrumb} />

      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* intro */}
        {/* <div className='col-span-12'>
          <Intro detail={intro} />
        </div> */}
        {/* Default */}
        <div className="col-span-12">
          <ChartRadarDefaultCode />
        </div>
        {/* Dots */}
        <div className="col-span-12">
          <ChartRadarDotsCode />
        </div>
        {/* Lines Only */}
        <div className="col-span-12">
          <ChartRadarLinesOnlyCode />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartRadarLabelCustomCode />
        </div>
        {/* Grid Custom */}
        <div className="col-span-12">
          <ChartRadarGridCustomCode />
        </div>
        {/* Grid None */}
        <div className="col-span-12">
          <ChartRadarGridNoneCode />
        </div>
        {/* Grid Circle */}
        <div className="col-span-12">
          <ChartRadarGridCircleCode />
        </div>
        {/* Grid Circle - No lines */}
        <div className="col-span-12">
          <ChartRadarGridCircleNoLinesCode />
        </div>
        {/* Grid Circle Filled */}
        <div className="col-span-12">
          <ChartRadarGridCircleFillCode />
        </div>

        <div className="col-span-12">
          <ChartRadarGridFillCode />
        </div>

        {/* Multiple */}
        <div className="col-span-12">
          <ChartRadarMultipleCode />
        </div>

        {/* Legend */}
        <div className="col-span-12">
          <ChartRadarLegendCode />
        </div>
      </div>
    </>
  );
};

export default page;
