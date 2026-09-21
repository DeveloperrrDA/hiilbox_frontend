import CodePreview from "@/app/components/shared/CodePreview";
import ChartBarStacked from "../StackedLegend";

function ChartBarStackedCode() {
  return (
    <CodePreview
      component={<ChartBarStacked />}
      filePath="src/app/components/shadcn-charts/bar/StackedLegend.tsx"
      title="Stacked + Legend"
    />
  );
}

export default ChartBarStackedCode;
