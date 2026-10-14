import CodePreview from "@/app/components/shared/CodePreview";
import BasicButtonCode from "./code/BasicButtonCode";

export default function BasicButton() {
  return (
    <CodePreview
      component={<BasicButtonCode />}
      filePath="src/app/components/shadcn-ui/Button/code/BasicButtonCode.tsx"
      title="Basic Button"
    />
  );
}
