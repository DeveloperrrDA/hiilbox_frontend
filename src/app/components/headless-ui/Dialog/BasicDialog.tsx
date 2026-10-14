'use client'

import BasicDialogCode from '../../shadcn-ui/Dialog/code/BasicDialogCode'
import CodePreview from '../../shared/CodePreview'

const BasicDialog = () => {
  return (
    <div>
      <CodePreview
        component={<BasicDialogCode />}
        filePath="src/app/components/headless-ui/Dialog/Code/BasicDialodCode.tsx"
        title="Rounded Inputs form"
      />
    </div>
  )
}

export default BasicDialog
