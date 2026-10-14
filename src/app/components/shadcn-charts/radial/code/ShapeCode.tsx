import CodePreview from "@/app/components/shared/CodePreview";
import Shape from "../Shape";

export default function ChartRadialShapeCode() {
  return (
    <>
      <CodePreview
        component={<Shape />}
        filePath="src/app/components/shadcn-charts/radial/Shape.tsx"
        title="Shape Chart"
      />
    </>
  );
}
