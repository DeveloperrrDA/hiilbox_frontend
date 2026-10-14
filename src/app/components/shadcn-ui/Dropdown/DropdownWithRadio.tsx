'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import DropdownwithRadio from './code/DropdownWithRadioCode'

const DropdownWithRadio = () => {
  return (
    <>
      <CodePreview
        component={<DropdownwithRadio />}
        filePath='src/app/components/shadcn-ui/Dropdown/code/DropdownWithRadioCode.tsx'
        title='Dropdown With Radio Group'
      />
    </>
  )
}

export default DropdownWithRadio
