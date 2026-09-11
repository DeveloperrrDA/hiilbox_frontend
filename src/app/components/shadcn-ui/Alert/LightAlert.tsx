'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Lightalert from './code/LightAlertCode'

const LightAlert = () => {
  return (
    <>
      <CodePreview
        component={<Lightalert />}
        filePath='src/app/components/shadcn-ui/Alert/code/LightAlertCode.tsx'
        title='Light Alert'
      />
    </>
  )
}

export default LightAlert
