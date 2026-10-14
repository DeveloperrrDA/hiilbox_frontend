import CodePreview from "@/app/components/shared/CodePreview";
import ChartBarDefault from "../Default";

function ChartBarDefaultCode() {
  return (
    <CodePreview
      component={<ChartBarDefault />}
      filePath="src/app/components/shadcn-charts/bar/Default.tsx"
      title="Default"
    />
  );
}

export default ChartBarDefaultCode;
