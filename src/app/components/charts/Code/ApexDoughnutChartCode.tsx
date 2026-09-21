import React from "react";
import CodePreview from "../../shared/CodePreview";
import ApexDoughnutChart from "../ApexDoughnutChart";

function ApexDoughnutChartCode() {
  return (
    <CodePreview
      component={<ApexDoughnutChart />}
      filePath="src/app/components/charts/ApexDoughnutChart.tsx"
    />
  );
}

export default ApexDoughnutChartCode;
