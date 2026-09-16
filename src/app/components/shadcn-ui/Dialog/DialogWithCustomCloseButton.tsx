'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import DialogWithCustomClose from './code/DialogWithCustomCloseCode'

const DialogWithCustomCloseButton = () => {
  return (
    <>
      <CodePreview
        component={<DialogWithCustomClose />}
        filePath='src/app/components/shadcn-ui/Dialog/code/DialogWithCustomCloseCode.tsx'
        title='Dialog With Custom Close'
      />
    </>
  )
}

export default DialogWithCustomCloseButton
