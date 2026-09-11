'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basictab from './code/BasicTabCode'

const BasicTab = () => {
  return (
    <>
      <CodePreview
        component={<Basictab />}
        filePath='src/app/components/shadcn-ui/Tab/code/BasicTabCode.tsx'
        title='Tab With Form'
      />
    </>
  )
}

export default BasicTab
