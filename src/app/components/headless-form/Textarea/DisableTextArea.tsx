import CodePreview from "../../shared/CodePreview";
import DisableTextAreaCode from "./Code/DisableTextAreaCode";

const DisableTextarea = () => {
  return (
    <CodePreview
      component={<DisableTextAreaCode />}
      filePath="src/app/components/headless-form/Textarea/Code/DisableTextAreaCode.tsx"
      title="Disabled Textarea"
    />
  );
};

export default DisableTextarea;
