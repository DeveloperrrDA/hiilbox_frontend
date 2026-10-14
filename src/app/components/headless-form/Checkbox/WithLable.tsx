"use client";

import CodePreview from "../../shared/CodePreview";
import WithlabelCode from "./Codes/WithLabelCode";

const WithLable = () => {
  return (
    <CodePreview
      component={<WithlabelCode />}
      filePath="src/app/components/headless-form/Checkbox/Codes/WithLabelCode.tsx"
      title="Checkbox Label"
    />
  );
};

export default WithLable;
