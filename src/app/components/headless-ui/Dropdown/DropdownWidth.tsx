'use client'

import CodePreview from '../../shared/CodePreview'
import DropdwonWidthCode from './Codes/DropdwonWidthCode'

const DropdownWidth = () => {
  return (
    <div>
      <CodePreview
        component={<DropdwonWidthCode />}
        filePath="src/app/components/headless-ui/Dropdown/Codes/DropdwonWidthCode.tsx"
        title="Dropdown Width"
      />
    </div>
  )
}

export default DropdownWidth
