import CodePreview from "../../shared/CodePreview"
import BasicPopoverCode from "./Code/BasicPopoverCode"

const BasicPopover = () => {
  return (
    <div>
      <CodePreview
        component={<BasicPopoverCode />}
        filePath="src/app/components/headless-ui/Popover/Code/BasicPopoverCode.tsx"
        title="Basic Popover"
      />
    </div>
  )
}

export default BasicPopover
