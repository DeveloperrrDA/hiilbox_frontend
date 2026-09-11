import React from "react";
import ApexGradientChart from "../ApexGradientChart";
import CodePreview from "../../shared/CodePreview";

function ApexGradientChartCode() {
  return (
    <CodePreview
      component={<ApexGradientChart />}
      filePath="src/app/components/charts/ApexGradientChart.tsx"
      title="Gradient Chart"
    />
  );
}

export default ApexGradientChartCode;
