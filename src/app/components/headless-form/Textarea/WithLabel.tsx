import CodePreview from "../../shared/CodePreview";
import WithLabelCode from "./Code/WithLabelCode";

const WithLabelTextarea = () => {
  return (
    <CodePreview
      component={<WithLabelCode />}
      filePath="src/app/components/headless-form/Textarea/Code/WithLabelCode.tsx"
      title="Label With Textarea"
    />
  );
};

export default WithLabelTextarea;
