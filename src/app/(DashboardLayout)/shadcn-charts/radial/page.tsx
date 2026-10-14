import ChartRadialSimpleCode from "@/app/components/shadcn-charts/radial/code/DefaultCode";
import ChartRadialGrid from "@/app/components/shadcn-charts/radial/code/GridCode";
import ChartRadialLabel from "@/app/components/shadcn-charts/radial/code/LabelCode";
import ChartRadialShape from "@/app/components/shadcn-charts/radial/code/ShapeCode";
import ChartRadialStacked from "@/app/components/shadcn-charts/radial/code/StackedCode";
import ChartRadialText from "@/app/components/shadcn-charts/radial/code/TextCode";
import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
 
export const metadata: Metadata = {
  title: "Radial Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Build radial charts and circular progress graphs with Shadcn UI components built with Tailwind React for dashboard percentage visualization.",
};
 
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Radial Chart",
  },
];
 
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Radial Chart" items={BCrumb} />
 
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* Default */}
        <div className="col-span-12">
          <ChartRadialSimpleCode />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartRadialLabel />
        </div>
        {/* Grid */}
        <div className="col-span-12">
          <ChartRadialGrid />
        </div>
        {/* Text */}
        <div className="col-span-12">
          <ChartRadialText />
        </div>
        {/* Shape */}
        <div className="col-span-12">
          <ChartRadialShape />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartRadialStacked />
        </div>
      </div>
    </>
  );
};
 
export default page;