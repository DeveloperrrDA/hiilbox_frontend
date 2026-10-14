import CodePreview from "@/app/components/shared/CodePreview";
import ChartRadarLegend from "../Legend";

function ChartRadarLegendCode() {
  return (
    <CodePreview
      component={<ChartRadarLegend />}
      filePath="src/app/components/shadcn-charts/radar/Legend.tsx"
      title="Legend"
    />
  );
}

export default ChartRadarLegendCode;
