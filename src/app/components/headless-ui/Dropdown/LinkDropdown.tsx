'use client'

import CodePreview from "../../shared/CodePreview"
import LinkDropdownCode from "./Codes/LinkDropdownCode"

const LinkDropdown = () => {
  return (
    <div>
      <CodePreview
        component={<LinkDropdownCode />}
        filePath="src/app/components/headless-ui/Dropdown/Codes/LinkDropdownCode.tsx"
        title="Links Dropdown"
      />
    </div>
  )
}

export default LinkDropdown
