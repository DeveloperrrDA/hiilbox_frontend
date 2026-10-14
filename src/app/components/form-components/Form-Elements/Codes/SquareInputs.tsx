import React from "react";
import SquareInputs from "../SquareInputs";
import CodePreview from "@/app/components/shared/CodePreview";
const SquareInputsCodes = () => {
  return (
    <>
      <CodePreview
        component={<SquareInputs />}
        filePath="src/app/components/form-components/Form-Elements/SquareInputs.tsx"
        title="Square Inputs form"
      />
    </>
  );
};

export default SquareInputsCodes;
