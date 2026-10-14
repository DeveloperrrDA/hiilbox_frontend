import CodePreview from "@/app/components/shared/CodePreview";
import ChartBarMultiple from "../Multiple";

function ChartBarMultipleCode() {
  return (
    <CodePreview
      component={<ChartBarMultiple />}
      filePath="src/app/components/shadcn-charts/bar/Multiple.tsx"
      title="Multiple"
    />
  );
}

export default ChartBarMultipleCode;
