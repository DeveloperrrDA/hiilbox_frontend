'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import BasicCardInfo from './code/BasicCardCode'

const BasicCard = () => {
  return (
    <>
      <CodePreview
        component={<BasicCardInfo />}
        filePath='src/app/components/shadcn-ui/Card/code/BasicCardCode.tsx'
      />
    </>
  )
}

export default BasicCard
