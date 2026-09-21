import CodePreview from "../../shared/CodePreview"
import ManuallActiveTabCodes from "./Code/ManuallActiveTabCode"

const MannuallActiveTab = () => {
  return (
    <div>
      <CodePreview
        component={<ManuallActiveTabCodes />}
        filePath="src/app/components/headless-ui/Tabs/Code/ManuallActiveTabCode.tsx"
        title="Manually Active Tab"
      />
    </div>
  )
}

export default MannuallActiveTab
