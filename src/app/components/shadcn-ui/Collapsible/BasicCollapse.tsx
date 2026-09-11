'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basiccollapse from './code/BasicCollapseCode'

const BasicCollapse = () => {
  return (
    <>
      <CodePreview
        component={<Basiccollapse />}
        filePath='src/app/components/shadcn-ui/Collapsible/code/BasicCollapseCode.tsx'
        title='Basic Collapse'
      />
    </>
  )
}

export default BasicCollapse
