import CodePreview from "@/app/components/shared/CodePreview";
import ChartAreaStep from "../Step";

function ChartAreaStepCode() {
  return (
    <CodePreview
      component={<ChartAreaStep />}
      filePath="src/app/components/shadcn-charts/area/Step.tsx"
      title="Linear"
    />
  );
}

export default ChartAreaStepCode;
