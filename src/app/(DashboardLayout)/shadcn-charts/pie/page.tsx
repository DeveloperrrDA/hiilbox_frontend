// import Intro from '@/app/(site)/ui-blocks/shared/Intro'
import ChartPieLabelCustom from "@/app/components/shadcn-charts/pie/CustomLabel";
import ChartPieSimple from "@/app/components/shadcn-charts/pie/Default";
import ChartPieDonut from "@/app/components/shadcn-charts/pie/Donut";
import ChartPieDonutActive from "@/app/components/shadcn-charts/pie/DonutActive";
import ChartPieDonutText from "@/app/components/shadcn-charts/pie/DonutWithText";
import ChartPieInteractive from "@/app/components/shadcn-charts/pie/Interactive";
import ChartPieLabel from "@/app/components/shadcn-charts/pie/Label";
import ChartPieLabelList from "@/app/components/shadcn-charts/pie/LabelList";
import ChartPieLegend from "@/app/components/shadcn-charts/pie/Legend";
import ChartPieSeparatorNone from "@/app/components/shadcn-charts/pie/SeparatorNone";
import ChartPieStacked from "@/app/components/shadcn-charts/pie/Stacked";
import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import ChartPieSimpleCode from "@/app/components/shadcn-charts/pie/code/DefaultCode";
import ChartPieSeparatorNoneCode from "@/app/components/shadcn-charts/pie/code/SeparatorNoneCode";
import ChartPieLabelCode from "@/app/components/shadcn-charts/pie/code/LabelCode";
import ChartPieLabelCustomCode from "@/app/components/shadcn-charts/pie/code/CustomLabelCode";
import ChartPieLabelListCode from "@/app/components/shadcn-charts/pie/code/LabelListCode";
import ChartPieLegendCode from "@/app/components/shadcn-charts/pie/code/LegendCode";
import ChartPieDonutCode from "@/app/components/shadcn-charts/pie/code/DonutCode";
import ChartPieDonutActiveCode from "@/app/components/shadcn-charts/pie/code/DonutActiveCode";
import ChartPieDonutTextCode from "@/app/components/shadcn-charts/pie/code/DonutWithTextCode";
import ChartPieStackedCode from "@/app/components/shadcn-charts/pie/code/StackedCode";
import ChartPieInteractiveCode from "@/app/components/shadcn-charts/pie/code/InteractiveCode";

export const metadata: Metadata = {
  title: "Pie Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Build circular pie charts and donut graphs with Shadcn UI components built with Tailwind React for dashboard proportional data representation.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Pie Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Pie Chart" items={BCrumb} />

      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* intro */}
        {/* <div className='col-span-12'>
          <Intro detail={intro} />
        </div> */}
        {/* Default */}
        <div className="col-span-12">
          <ChartPieSimpleCode />
        </div>
        {/* Separator None */}
        <div className="col-span-12">
          <ChartPieSeparatorNoneCode />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartPieLabelCode />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartPieLabelCustomCode />
        </div>
        {/* Label List */}
        <div className="col-span-12">
          <ChartPieLabelListCode />
        </div>
        {/* Legend */}
        <div className="col-span-12">
          <ChartPieLegendCode />
        </div>
        {/* Donut */}
        <div className="col-span-12">
          <ChartPieDonutCode />
        </div>
        {/* Donut Active */}
        <div className="col-span-12">
          <ChartPieDonutActiveCode />
        </div>
        {/* Donut With Text */}
        <div className="col-span-12">
          <ChartPieDonutTextCode />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartPieStackedCode />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartPieInteractiveCode />
        </div>
      </div>
    </>
  );
};

export default page;
