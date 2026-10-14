"use client";
import CodePreview from "../../shared/CodePreview";
import RenderAsElementsCode from "./Codes/RenderAsElements";

const RenderSwitches = () => {
  return (
    <CodePreview
      component={<RenderAsElementsCode />}
      filePath="src/app/components/headless-form/Switch/Codes/RenderAsElements.tsx"
      title="Rendering as Element"
    />
  );
};

export default RenderSwitches;
