import CodePreview from "../../shared/CodePreview"
import DisableTabCode from "./Code/DisableTabCode"

const DisableTab = () => {
  return (
    <div>
      <CodePreview
        component={<DisableTabCode />}
        filePath="src/app/components/headless-ui/Tabs/Code/DisableTabCode.tsx"
        title="Disable Tab"
      />
    </div>
  )
}

export default DisableTab
