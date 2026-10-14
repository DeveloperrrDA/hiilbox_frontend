import CodePreview from "@/app/components/shared/CodePreview";
import ChartBarHorizontal from "../Horizontal";

function ChartBarHorizontalCode() {
  return (
    <CodePreview
      component={<ChartBarHorizontal />}
      filePath="src/app/components/shadcn-charts/bar/Horizontal.tsx"
      title="Horizontal"
    />
  );
}

export default ChartBarHorizontalCode;
