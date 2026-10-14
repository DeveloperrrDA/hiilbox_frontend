import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieLabel from "../Label";

function ChartPieLabelCode() {
  return (
    <CodePreview
      component={<ChartPieLabel />}
      filePath="src/app/components/shadcn-charts/pie/Label.tsx"
      title="Label"
    />
  );
}

export default ChartPieLabelCode;
