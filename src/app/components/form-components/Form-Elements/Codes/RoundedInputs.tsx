import React from "react";
import RoundedInputs from "../RoundedInputs";
import CodePreview from "@/app/components/shared/CodePreview";
const RoundInputsCodes = () => {
  return (
    <div>
      <CodePreview
        component={<RoundedInputs />}
        filePath="src/app/components/form-components/Form-Elements/RoundedInputs.tsx"
        title="Rounded Inputs form"
      />
    </div>
  );
};

export default RoundInputsCodes;
