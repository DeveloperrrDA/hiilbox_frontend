import CodePreview from "@/app/components/shared/CodePreview";
import Label from "../Label";

export default function ChartRadialLabelCode() {
  return (
    <>
      <CodePreview
        component={<Label />}
        filePath="src/app/components/shadcn-charts/radial/Label.tsx"
        title="Label Chart"
      />
    </>
  );
}
