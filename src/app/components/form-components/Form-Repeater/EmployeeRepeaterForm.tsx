import React from "react";
import EmployeeRepeaterFormCode from "./code/EmployeeRepeaterFormCode";
import CodePreview from "../../shared/CodePreview";

function EmployeeRepeaterForm() {
  return (
    <CodePreview
      component={<EmployeeRepeaterFormCode />}
      filePath="src/app/components/form-components/Form-Repeater/code/EmployeeRepeaterFormCode.tsx"
      title="Registration Form"
    />
  );
}

export default EmployeeRepeaterForm;
