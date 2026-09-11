import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieDonut from "../Donut";

function ChartPieDonutCode() {
  return (
    <CodePreview
      component={<ChartPieDonut />}
      filePath="src/app/components/shadcn-charts/pie/Donut.tsx"
      title="Donut"
    />
  );
}

export default ChartPieDonutCode;
