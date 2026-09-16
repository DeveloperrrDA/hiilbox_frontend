'use client'

import CodePreview from "../../shared/CodePreview"
import FramerPopoverCode from "./Code/FramerPopoverCode"

const FramerMotionPopover = () => {
  return (
    <div>
      <CodePreview
        component={<FramerPopoverCode />}
        filePath="src/app/components/headless-ui/Popover/Code/FramerPopoverCode.tsx"
        title="Framer Motion Popover"
      />
    </div>
  )
}

export default FramerMotionPopover
