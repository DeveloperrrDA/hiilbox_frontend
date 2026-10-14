import CodePreview from "@/app/components/shared/CodePreview";
import ChartAreaStacked from "../Stacked";

function ChartAreaStackedCode() {
  return (
    <CodePreview
      component={<ChartAreaStacked />}
      filePath="src/app/components/shadcn-charts/area/Stacked.tsx"
      title="Stacked"
    />
  );
}

export default ChartAreaStackedCode;
