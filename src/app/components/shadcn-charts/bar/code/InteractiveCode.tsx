import CodePreview from "@/app/components/shared/CodePreview";
import ChartBarInteractive from "../Interactive";

function ChartBarInteractiveCode() {
  return (
    <CodePreview
      component={<ChartBarInteractive />}
      filePath="src/app/components/shadcn-charts/bar/Interactive.tsx"
      title="Interactive"
    />
  );
}

export default ChartBarInteractiveCode;
