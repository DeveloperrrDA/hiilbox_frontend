import CodePreview from "../../shared/CodePreview"
import VerticalTabsCode from "./Code/VerticalTabsCode"

const VerticalTabs = () => {
  return (
    <div>
      <CodePreview
              component={<VerticalTabsCode />}
              filePath="src/app/components/headless-ui/Tabs/Code/VerticalTabsCode.tsx"
              title="Vertical Tabs"
            />
    </div>
  )
}

export default VerticalTabs
