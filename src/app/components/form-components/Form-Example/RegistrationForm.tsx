import React from "react";
import CodePreview from "../../shared/CodePreview";
import RegistrationFormCode from "./code/RegistrationFormCode";

function RegistrationForm() {
  return (
    <CodePreview
      component={<RegistrationFormCode />}
      filePath="src/app/components/form-components/Form-Example/code/RegistrationFormCode.tsx"
      title="Registration Form"
    />
  );
}

export default RegistrationForm;
