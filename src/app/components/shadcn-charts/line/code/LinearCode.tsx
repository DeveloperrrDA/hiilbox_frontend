import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineLinear from "../Linear";

function ChartLineLinearCode() {
  return (
    <CodePreview
      component={<ChartLineLinear />}
      filePath="src/app/components/shadcn-charts/line/Linear.tsx"
      title="Linear"
    />
  );
}

export default ChartLineLinearCode;
