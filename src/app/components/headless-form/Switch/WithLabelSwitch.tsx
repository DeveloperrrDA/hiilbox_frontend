"use client";

import CodePreview from "../../shared/CodePreview";
import WithLabelswitchCode from "./Codes/WithLabelSwitchCode";

const WithLabelSwitch = () => {
  return (
    <CodePreview
      component={<WithLabelswitchCode />}
      filePath="src/app/components/headless-form/Switch/Codes/WithLabelSwitchCode.tsx"
      title="Adding a Label"
    />
  );
};

export default WithLabelSwitch;
