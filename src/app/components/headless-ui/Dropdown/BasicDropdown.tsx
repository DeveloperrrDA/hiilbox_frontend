'use client'

import BasicDialogCode from '../../shadcn-ui/Dialog/code/BasicDialogCode'
import CodePreview from '../../shared/CodePreview'

const BasicDropdown = () => {
  return (
    <div>
      <CodePreview
        component={<BasicDialogCode />}
        filePath="src/app/components/headless-ui/Dropdown/Codes/BasicDropdownCode.tsx"
        title="Basic Dropdown"
      />
    </div>
  )
}

export default BasicDropdown
