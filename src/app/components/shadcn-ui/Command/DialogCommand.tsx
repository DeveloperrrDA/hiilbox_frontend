'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Dialogcommand from './code/DialogCommandCode'

const DialogCommand = () => {
  return (
    <>
      <CodePreview
        component={<Dialogcommand />}
        filePath='src/app/components/shadcn-ui/Command/code/DialogCommandCode.tsx'
        title='Dialog Command'
        subtitle='Please press CTRL + J to show command dialog'
      />
    </>
  )
}

export default DialogCommand
