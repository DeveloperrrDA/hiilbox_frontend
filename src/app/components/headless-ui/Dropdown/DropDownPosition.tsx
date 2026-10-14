'use client'

import CodePreview from '../../shared/CodePreview'
import DropdownPositionCode from './Codes/DropdownPositionCode'

const DropDownPosition = () => {
  return (
    <div>
      <CodePreview
        component={<DropdownPositionCode />}
        filePath="src/app/components/headless-ui/Dropdown/Codes/DropdownPositionCode.tsx"
        title="Position"
      />
    </div>
  )
}

export default DropDownPosition
