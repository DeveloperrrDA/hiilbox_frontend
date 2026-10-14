import React from "react";
import CodePreview from "../../shared/CodePreview";
import ApexAreaChart from "../ApexAreaChart";

function ApexAreaChartCode() {
  return (
    <CodePreview
      component={<ApexAreaChart />}
      filePath="src/app/components/charts/ApexAreaChart.tsx"
      title="Area Chart"
    />
  );
}

export default ApexAreaChartCode;
