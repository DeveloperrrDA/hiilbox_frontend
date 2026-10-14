import CodePreview from "@/app/components/shared/CodePreview";
import ChartPieSimple from "../Default";

function ChartPieSimpleCode() {
  return (
    <CodePreview
      component={<ChartPieSimple />}
      filePath="src/app/components/shadcn-charts/pie/Default.tsx"
      title="Default"
    />
  );
}

export default ChartPieSimpleCode;
