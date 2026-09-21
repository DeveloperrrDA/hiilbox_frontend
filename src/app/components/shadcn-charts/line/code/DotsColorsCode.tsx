import CodePreview from "@/app/components/shared/CodePreview";
import ChartLineDefault from "../Default";
import ChartLineDotsColors from "../DotsColors";

function ChartLineDotsColorsCode() {
  return (
    <CodePreview
      component={<ChartLineDotsColors />}
      filePath="src/app/components/shadcn-charts/line/DotsColors.tsx"
      title="Dots Color"
    />
  );
}

export default ChartLineDotsColorsCode;
