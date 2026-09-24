import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieDonut from "../Donut";
import ChartPieDonutActive from "../DonutActive";

function ChartPieDonutActiveCode() {
  return (
    <CodePreview
      component={<ChartPieDonutActive />}
      filePath="src/app/components/shadcn-charts/pie/DonutActive.tsx"
      title="Donut active"
    />
  );
}

export default ChartPieDonutActiveCode;
