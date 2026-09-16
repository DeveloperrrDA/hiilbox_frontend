import React from "react";
import CodePreview from "../../shared/CodePreview";
import HealthCareWizardFormCode from "./code/HealthCareWizardFormCode";

function HealthCareWizardForm() {
  return (
    <CodePreview
      component={<HealthCareWizardFormCode />}
      filePath="src/app/components/form-components/Form-Wizard/code/HealthCareWizardFormCode.tsx"
      title="HealthCareWizard Form  "
    />
  );
}

export default HealthCareWizardForm;
