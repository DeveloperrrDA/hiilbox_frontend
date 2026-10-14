import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieStacked from "../Stacked";

function ChartPieStackedCode() {
  return (
    <CodePreview
      component={<ChartPieStacked />}
      filePath="src/app/components/shadcn-charts/pie/Stacked.tsx"
      title="Stacked"
    />
  );
}

export default ChartPieStackedCode;
