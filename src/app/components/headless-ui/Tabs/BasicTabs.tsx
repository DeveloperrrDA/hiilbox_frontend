import CodePreview from "../../shared/CodePreview"
import BasicTabsCode from "./Code/BasicTabsCode"

const BasicTabs = () => {
  return (
    <div>
      <CodePreview
        component={<BasicTabsCode />}
        filePath="src/app/components/headless-ui/Tabs/Code/BasicTabsCode.tsx"
        title="Basic Tabs"
      />
    </div>
  )
}

export default BasicTabs
