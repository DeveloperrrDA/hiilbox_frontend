import React from "react";
import CodePreview from "../../shared/CodePreview";
import StudentEnrollmentFormCode from "./code/StudentEnrollmentFormCode";

function StudentEnrollmentForm() {
  return (
    <CodePreview
      component={<StudentEnrollmentFormCode />}
      filePath="src/app/components/form-components/Form-Example/code/StudentEnrollmentFormCode.tsx"
      title="Registration Form"
    />
  );
}

export default StudentEnrollmentForm;
