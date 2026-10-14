import CodePreview from "../../shared/CodePreview";
import BasictextareaCode from "./Code/BasicTextareaCode";

const BasicTextarea = () => {
  return (
    <CodePreview
      component={<BasictextareaCode />}
      filePath="src/app/components/headless-form/Textarea/Code/BasicTextareaCode.tsx"
      title="Basic Textarea"
    />
  );
};

export default BasicTextarea;
