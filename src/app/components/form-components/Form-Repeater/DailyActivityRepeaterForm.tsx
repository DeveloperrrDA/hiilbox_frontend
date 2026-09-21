import React from "react";
import CodePreview from "../../shared/CodePreview";
import DailyActivityRepeaterFormCode from "./code/DailyActivityRepeaterFormCode";

function DailyActivityRepeaterForm() {
  return (
    <CodePreview
      component={<DailyActivityRepeaterFormCode />}
      filePath="src/app/components/form-components/Form-Repeater/code/DailyActivityRepeaterFormCode.tsx"
      title="DailyActivityRepeater Form "
    />
  );
}

export default DailyActivityRepeaterForm;
