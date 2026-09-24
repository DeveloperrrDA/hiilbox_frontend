"use client";

import CodePreview from "../../shared/CodePreview";
import DisableSwitchCode from "./Codes/DisableSwitchesCode";

const DisabledSwitches = () => {
  return (
    <CodePreview
      component={<DisableSwitchCode />}
      filePath="src/app/components/headless-form/Switch/Codes/DisableSwitchesCode.tsx"
      title="Disabled Switches"
    />
  );
};

export default DisabledSwitches;
