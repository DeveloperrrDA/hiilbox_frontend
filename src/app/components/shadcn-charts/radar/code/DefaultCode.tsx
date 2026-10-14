import CodePreview from "@/app/components/shared/CodePreview";
import ChartRadarDefault from "../Default";

function ChartRadarDefaultCode() {
  return (
    <CodePreview
      component={<ChartRadarDefault />}
      filePath="src/app/components/shadcn-charts/radar/Default.tsx"
      title="Default"
    />
  );
}

export default ChartRadarDefaultCode;
