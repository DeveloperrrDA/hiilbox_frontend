'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basicdialog from './code/BasicDialogCode'

const BasicDialog = () => {
  return (
    <>
      <CodePreview
        component={<Basicdialog />}
        filePath='src/app/components/shadcn-ui/Dialog/code/BasicDialogCode.tsx'
        title='Basic Dialog'
      />
    </>
  )
}

export default BasicDialog
