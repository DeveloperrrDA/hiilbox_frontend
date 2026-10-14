'use client'

import CodePreview from "../../shared/CodePreview"
import GroupItemCode from "./Codes/GroupItemCode"

const GroupingItems = () => {
  return (
    <div>
      <CodePreview
        component={<GroupItemCode />}
        filePath="src/app/components/headless-ui/Dropdown/Codes/GroupItemCode.tsx"
        title="Grouping Items"
      />
    </div>
  )
}

export default GroupingItems
