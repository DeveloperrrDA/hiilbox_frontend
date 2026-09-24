import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineDefault from "../Default";

function ChartLineDefaultCode() {
  return (
    <CodePreview
      component={<ChartLineDefault />}
      filePath="src/app/components/shadcn-charts/line/Default.tsx"
      title="Default"
    />
  );
}

export default ChartLineDefaultCode;
