import CodePreview from "@/app/components/shared/CodePreview";
import Stacked from "../Stacked";

export default function ChartRadialStackedCode() {
  return (
    <>
      <CodePreview
        component={<Stacked />}
        filePath="src/app/components/shadcn-charts/radial/Stacked.tsx"
        title="Stacked Chart"
      />
    </>
  );
}
