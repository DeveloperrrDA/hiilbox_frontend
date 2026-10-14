'use client'

import CodePreview from '../../shared/CodePreview'
import ScrollableDialogCode from './Code/ScrollableDialogCode'

const ScrollableDialog = () => {
  return (
    <div>
      <CodePreview
        component={<ScrollableDialogCode />}
        filePath="src/app/components/headless-ui/Dialog/Code/ScrollableDialogCode.tsx"
        title="Scrollable Dialog"
      />
    </div>
  )
}

export default ScrollableDialog
