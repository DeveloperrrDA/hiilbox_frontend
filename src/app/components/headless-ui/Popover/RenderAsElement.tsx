'use client'

import CodePreview from "../../shared/CodePreview"
import RenderPopoverCode from "./Code/RenderPopoverCode"

const RenderAsElement = () => {
  return (
    <div>
      <CodePreview
        component={<RenderPopoverCode />}
        filePath="src/app/components/headless-ui/Popover/Code/RenderPopoverCode.tsx"
        title="Rendering Different Elements"
      />
    </div>
  )
}

export default RenderAsElement
