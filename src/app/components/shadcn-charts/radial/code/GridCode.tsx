import CodePreview from "@/app/components/shared/CodePreview";
import Grid from "../Grid";

export default function ChartRadialGridCode() {
  return (
    <>
      <CodePreview
        component={<Grid />}
        filePath="src/app/components/shadcn-charts/radial/Grid.tsx"
        title="Grid Chart"
      />
    </>
  );
}
