import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineStep from "../Step";

function ChartLineStepCode() {
  return (
    <CodePreview
      component={<ChartLineStep />}
      filePath="src/app/components/shadcn-charts/line/Step.tsx"
      title="Step"
    />
  );
}

export default ChartLineStepCode;
