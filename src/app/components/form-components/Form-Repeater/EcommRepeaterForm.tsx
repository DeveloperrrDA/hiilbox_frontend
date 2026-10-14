import React from "react";
import CodePreview from "../../shared/CodePreview";
import EmployeeRepeaterFormCode from "./code/EmployeeRepeaterFormCode";

function EcommRepeaterForm() {
  return (
    <CodePreview
      component={<EmployeeRepeaterFormCode />}
      filePath="src/app/components/form-components/Form-Repeater/code/EmployeeRepeaterFormCode.tsx"
      title="EcommRepeater Form"
    />
  );
}

export default EcommRepeaterForm;
