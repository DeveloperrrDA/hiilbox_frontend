"use client";

import CodePreview from "../../shared/CodePreview";
import BasicSwitchCode from "./Codes/BasicSwitchCode";

const BasicSwitches = () => {
  return (
    <CodePreview
      component={<BasicSwitchCode />}
      filePath="src/app/components/headless-form/Switch/Codes/BasicSwitchCode.tsx"
      title="Basic Switches"
    />
  );
};

export default BasicSwitches;
