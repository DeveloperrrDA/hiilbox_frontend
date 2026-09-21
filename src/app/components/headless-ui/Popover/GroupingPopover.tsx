import CodePreview from "../../shared/CodePreview"
import GroupingPopoverCode from "./Code/GroupingPopoverCode"

const GroupingPopover = () => {
  return (
    <div>
      <CodePreview
        component={<GroupingPopoverCode />}
        filePath="src/app/components/headless-ui/Popover/Code/GroupingPopoverCode.tsx"
        title="Grouping Related Popover"
      />
    </div>
  )
}

export default GroupingPopover
