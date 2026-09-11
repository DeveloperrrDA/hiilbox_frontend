import CodePreview from "@/app/components/shared/CodePreview";
import RadialText from "../RadialText";

export default function ChartRadialText() {
  return (
    <>
      <CodePreview
        component={<RadialText />}
        filePath="src/app/components/shadcn-charts/radial/RadialText.tsx"
        title="Text Chart"
      />
    </>
  );
}
