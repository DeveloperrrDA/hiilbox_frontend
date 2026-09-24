import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieLegend from "../Legend";

function ChartPieLegendCode() {
  return (
    <CodePreview
      component={<ChartPieLegend />}
      filePath="src/app/components/shadcn-charts/pie/Legend.tsx"
      title="Legend"
    />
  );
}

export default ChartPieLegendCode;
