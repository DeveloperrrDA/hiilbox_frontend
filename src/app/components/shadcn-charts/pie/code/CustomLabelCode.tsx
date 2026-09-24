import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieLabelCustom from "../CustomLabel";

function ChartPieLabelCustomCode() {
  return (
    <CodePreview
      component={<ChartPieLabelCustom />}
      filePath="src/app/components/shadcn-charts/pie/CustomLabel.tsx"
      title="Custom Label"
    />
  );
}

export default ChartPieLabelCustomCode;
