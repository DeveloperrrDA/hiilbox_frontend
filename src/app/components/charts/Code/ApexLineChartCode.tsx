import React from "react";
import CodePreview from "../../shared/CodePreview";
import ApexLineChart from "../ApexLineChart";

function ApexLineChartCode() {
  return (
    <CodePreview
      component={<ApexLineChart />}
      filePath="src/app/components/charts/ApexLineChart.tsx"
      title="Line Chart"
    />
  );
}

export default ApexLineChartCode;
