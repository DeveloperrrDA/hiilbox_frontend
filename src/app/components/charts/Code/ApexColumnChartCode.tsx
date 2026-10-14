import React from "react";
import ApexColumnChart from "../ApexColumnChart";
import CodePreview from "../../shared/CodePreview";

function ApexColumnChartCode() {
  return (
    <CodePreview
      component={<ApexColumnChart />}
      filePath="src/app/components/charts/ApexColumnChart.tsx"
      title="Column Chart"
    />
  );
}

export default ApexColumnChartCode;
