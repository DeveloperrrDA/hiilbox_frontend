'use client'

import CodePreview from "../../shared/CodePreview"
import DisableItemCode from "./Codes/DisableItemCode"


const DisablingItem = () => {
  return (
    <div>
      <CodePreview
        component={<DisableItemCode />}
        filePath="src/app/components/headless-ui/Dropdown/Codes/DisableItemCode.tsx"
        title="Disable Items"
      />
    </div>
  )
}

export default DisablingItem
