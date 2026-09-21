import CodePreview from "@/app/components/shared/CodePreview";
import ChartAreaLinear from "../Linear";

function ChartAreaLinearCode() {
  return (
    <CodePreview
      component={<ChartAreaLinear />}
      filePath="src/app/components/shadcn-charts/area/Linear.tsx"
      title="Linear"
    />
  );
}

export default ChartAreaLinearCode;
