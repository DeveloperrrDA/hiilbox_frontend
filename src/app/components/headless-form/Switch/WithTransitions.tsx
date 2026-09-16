"use client";
import CodePreview from "../../shared/CodePreview";
import WithTransitionCode from "./Codes/WithTransitionCode";

const WithTransitionsSwitch = () => {
  return (
    <CodePreview
      component={<WithTransitionCode />}
      filePath="src/app/components/headless-form/Switch/Codes/WithTransitionCode.tsx"
      title="Adding Transitions"
    />
  );
};

export default WithTransitionsSwitch;
