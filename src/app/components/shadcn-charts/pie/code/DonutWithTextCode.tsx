import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieDonutText from "../DonutWithText";

function ChartPieDonutTextCode() {
  return (
    <CodePreview
      component={<ChartPieDonutText />}
      filePath="src/app/components/shadcn-charts/pie/DonutWithText.tsx"
      title="Donut With Text"
    />
  );
}

export default ChartPieDonutTextCode;
