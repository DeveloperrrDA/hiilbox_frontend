import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import ChartBarDefaultCode from "@/app/components/shadcn-charts/bar/code/DefaultCode";
import ChartBarHorizontalCode from "@/app/components/shadcn-charts/bar/code/HorizontalCode";
import ChartBarMultipleCode from "@/app/components/shadcn-charts/bar/code/MultipleCode";
import ChartBarStackedCode from "@/app/components/shadcn-charts/bar/code/StackedLegendCode";
import ChartBarLabelCode from "@/app/components/shadcn-charts/bar/code/LabelCode";
import ChartBarLabelCustomCode from "@/app/components/shadcn-charts/bar/code/CustomLabelCode";
import ChartBarMixedCode from "@/app/components/shadcn-charts/bar/code/MixedCode";
import ChartBarActiveCode from "@/app/components/shadcn-charts/bar/code/ActiveCode";
import ChartBarNegativeCode from "@/app/components/shadcn-charts/bar/code/NegativeCode";
import ChartBarInteractiveCode from "@/app/components/shadcn-charts/bar/code/InteractiveCode";

export const metadata: Metadata = {
  title: "Bar Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Build interactive bar charts and column graphs with Shadcn UI components built with Tailwind React for dashboard statistical display.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Bar Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Bar Chart" items={BCrumb} />

      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* intro */}
        {/* <div className='col-span-12'>
          <Intro detail={intro} />
        </div> */}
        {/* Default */}
        <div className="col-span-12">
          <ChartBarDefaultCode />
        </div>
        {/* Horizontal */}
        <div className="col-span-12">
          <ChartBarHorizontalCode />
        </div>
        {/* Multiple */}
        <div className="col-span-12">
          <ChartBarMultipleCode />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartBarStackedCode />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartBarLabelCode />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartBarLabelCustomCode />
        </div>
        {/* Mixed */}
        <div className="col-span-12">
          <ChartBarMixedCode />
        </div>
        {/* Active */}
        <div className="col-span-12">
          <ChartBarActiveCode />
        </div>
        {/* Negative */}
        <div className="col-span-12">
          <ChartBarNegativeCode />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartBarInteractiveCode />
        </div>
      </div>
    </>
  );
};

export default page;
