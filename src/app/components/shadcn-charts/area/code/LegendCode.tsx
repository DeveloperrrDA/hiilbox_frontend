import CodePreview from "@/app/components/shared/CodePreview";
import ChartAreaLegend from "../Legend";

function ChartAreaLegendCode() {
  return (
    <CodePreview
      component={<ChartAreaLegend />}
      filePath="src/app/components/shadcn-charts/area/Legend.tsx"
      title="Legend"
    />
  );
}

export default ChartAreaLegendCode;
