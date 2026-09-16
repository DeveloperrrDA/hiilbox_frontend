import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineLabelCustom from "../CustomLabel";

function ChartLineLabelCustomCode() {
  return (
    <CodePreview
      component={<ChartLineLabelCustom />}
      filePath="src/app/components/shadcn-charts/line/CustomLabel.tsx"
      title="Custom Label"
    />
  );
}

export default ChartLineLabelCustomCode;
