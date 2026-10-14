import React from "react";
import CodePreview from "../../shared/CodePreview";
import CourseRepeaterFormCode from "./code/CourseRepeaterFormCode";

function CourseRepeaterForm() {
  return (
    <CodePreview
      component={<CourseRepeaterFormCode />}
      filePath="src/app/components/form-components/Form-Repeater/code/CourseRepeaterFormCode.tsx"
      title="CourseRepeater Form "
    />
  );
}

export default CourseRepeaterForm;
