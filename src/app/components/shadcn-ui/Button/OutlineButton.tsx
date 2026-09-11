'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Outlinebutton from './code/OutlineButtonCode'

const OutlineButton = () => {
  return (
    <>
      <CodePreview
        component={<Outlinebutton />}
        filePath='src/app/components/shadcn-ui/Button/code/OutlineButtonCode.tsx'
        title='Outline Button'
      />
    </>
  )
}

export default OutlineButton
