'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basicalert from './code/BasicAlertCode'

const BasicAlert = () => {
  return (
    <>
      <CodePreview
        component={<Basicalert />}
        filePath='src/app/components/shadcn-ui/Alert/code/BasicAlertCode.tsx'
        title='Basic Alert'
      />
    </>
  )
}

export default BasicAlert
