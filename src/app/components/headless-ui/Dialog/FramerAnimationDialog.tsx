'use client'

import CodePreview from "../../shared/CodePreview"
import FramerMotionDialogCode from "./Code/FramerMotionDialogCode"

const FramerAnimationDialog = () => {
  return (
    <div>
      <CodePreview
        component={<FramerMotionDialogCode />}
        filePath="src/app/components/headless-ui/Dialog/Code/FramerMotionDialogCode.tsx"
        title="Framer Motion Dialog"
      />
    </div>
  )
}

export default FramerAnimationDialog
