import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineInteractive from "../Interactive";

function ChartLineInteractiveCode() {
  return (
    <CodePreview
      component={<ChartLineInteractive />}
      filePath="src/app/components/shadcn-charts/line/Interactive.tsx"
      title="Interactive"
    />
  );
}

export default ChartLineInteractiveCode;
