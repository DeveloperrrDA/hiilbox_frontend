import CodePreview from "../../shared/CodePreview"
import SpecifiedDefaultCode from "./Code/SpecifiedDefaultCode"

const SpecifiedTab = () => {
  return (
    <div>
      <CodePreview
        component={<SpecifiedDefaultCode />}
        filePath="src/app/components/headless-ui/Tabs/Code/SpecifiedDefaultCode.tsx"
        title="Specifying The Default Tab"
      />
    </div>
  )
}

export default SpecifiedTab
