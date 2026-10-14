'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basicdropdown from './code/BasicDropdownCode'

const BasicDropdown = () => {
  return (
    <>
      <CodePreview
        component={<Basicdropdown />}
        filePath='src/app/components/shadcn-ui/Dropdown/code/BasicDropdownCode.tsx'
        title='Basic Dropdown'
      />
    </>
  )
}

export default BasicDropdown
