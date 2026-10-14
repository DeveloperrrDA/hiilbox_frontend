import CodePreview from "@/app/components/shared/CodePreview";
import ChartAreaInteractive from "../Interactive";

function ChartAreaInteractiveCode() {
  return (
    <CodePreview
      component={<ChartAreaInteractive />}
      filePath="src/app/components/shadcn-charts/area/Interactive.tsx"
      title="Interactive"
    />
  );
}

export default ChartAreaInteractiveCode;
