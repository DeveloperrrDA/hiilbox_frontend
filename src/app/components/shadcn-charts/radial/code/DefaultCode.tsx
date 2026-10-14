import CodePreview from "@/app/components/shared/CodePreview";
import Default from "../Default";

export default function ChartRadialSimpleCode() {
  return (
    <>
      <CodePreview
        component={<Default />}
        filePath="src/app/components/shadcn-charts/radial/Default.tsx"
        title="Default Chart"
      />
    </>
  );
}
