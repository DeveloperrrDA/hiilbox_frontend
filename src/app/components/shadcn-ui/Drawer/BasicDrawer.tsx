'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basicdrawer from './code/BasicDrawerCode'

const BasicDrawer = () => {
  return (
    <>
      <CodePreview
        component={<Basicdrawer />}
        filePath='src/app/components/shadcn-ui/Drawer/code/BasicDrawerCode.tsx'
        title='Basic Drawer'
      />
    </>
  )
}

export default BasicDrawer
