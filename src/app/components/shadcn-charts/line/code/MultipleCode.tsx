import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineMultiple from "../Multiple";

function ChartLineMultipleCode() {
  return (
    <CodePreview
      component={<ChartLineMultiple />}
      filePath="src/app/components/shadcn-charts/line/Multiple.tsx"
      title="Multiple"
    />
  );
}

export default ChartLineMultipleCode;
