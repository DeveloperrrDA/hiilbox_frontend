import React from "react";
import ApexCandleSticks from "../ApexCandleSticks";
import CodePreview from "../../shared/CodePreview";

function ApexCandleStickCode() {
  return (
    <CodePreview
      component={<ApexCandleSticks />}
      filePath="src/app/components/charts/ApexCandleSticks.tsx"
      title="CandleStick Chart"
    />
  );
}

export default ApexCandleStickCode;
