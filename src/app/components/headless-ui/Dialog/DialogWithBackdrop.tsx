'use client'

import CodePreview from '../../shared/CodePreview'
import WithBackdropCode from './Code/WithBackdropCode'

const DialogWithBackdrop = () => {
  return (
    <div>
      <CodePreview
        component={<WithBackdropCode />}
        filePath="src/app/components/headless-ui/Dialog/Code/WithBackdropCode.tsx"
        title="Dialog With Backdrop"
      />
    </div>
  )
}

export default DialogWithBackdrop
