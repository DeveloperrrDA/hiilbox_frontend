import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineLabel from "../Label";

function ChartLineLabelCode() {
  return (
    <CodePreview
      component={<ChartLineLabel />}
      filePath="src/app/components/shadcn-charts/line/Label.tsx"
      title="Label"
    />
  );
}

export default ChartLineLabelCode;
