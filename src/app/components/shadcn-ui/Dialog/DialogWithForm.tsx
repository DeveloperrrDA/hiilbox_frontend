'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import DialogwithForm from './code/DialogWithFormCode'

const DialogWithForm = () => {
  return (
    <>
      <CodePreview
        component={<DialogwithForm />}
        filePath='src/app/components/shadcn-ui/Dialog/code/DialogWithFormCode.tsx'
        title='Dialog With Custom Close'
      />
    </>
  )
}

export default DialogWithForm
