import EcommFormWizardCode from "./code/EcommFormWizardCode";
import CodePreview from "../../shared/CodePreview";

function EcommFormWizard() {
  return (
    <CodePreview
      component={<EcommFormWizardCode />}
      filePath="src/app/components/form-components/Form-Wizard/code/EcommFormWizardCode.tsx"
      title="EcommFormWizard Form "
    />
  );
}

export default EcommFormWizard;
