import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieInteractive from "../Interactive";

function ChartPieInteractiveCode() {
  return (
    <CodePreview
      component={<ChartPieInteractive />}
      filePath="src/app/components/shadcn-charts/pie/Interactive.tsx"
      title="Interactive"
    />
  );
}

export default ChartPieInteractiveCode;
