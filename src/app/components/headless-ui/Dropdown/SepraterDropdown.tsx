'use client'

import CodePreview from "../../shared/CodePreview"
import SepratingItemsCode from "./Codes/SepratingItemsCode"


const SepratorDropdown = () => {
  return (
    <div>
      <CodePreview
              component={<SepratingItemsCode />}
              filePath="src/app/components/headless-ui/Dropdown/Codes/SepratingItemsCode.tsx"
              title="Separating Items"
            />
    </div>
  )
}

export default SepratorDropdown
