"use client";

import CodePreview from "../../shared/CodePreview";
import DefaultOnCode from "./Codes/DefaultOnSwitchCode";

const DEfaultOnSwitches = () => {
  return (
    <CodePreview
      component={<DefaultOnCode />}
      filePath="src/app/components/headless-form/Switch/Codes/DefaultOnSwitchCode.tsx"
      title="Default On Switches"
    />
  );
};

export default DEfaultOnSwitches;
