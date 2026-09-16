import CodePreview from "@/app/components/shared/CodePreview";
import ChartBarLabel from "../Label";

function ChartBarLabelCustomCode() {
  return (
    <CodePreview
      component={<ChartBarLabel />}
      filePath="src/app/components/shadcn-charts/bar/Label.tsx"
      title="Custom Label"
    />
  );
}

export default ChartBarLabelCustomCode;
