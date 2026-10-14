'use client'
import CodePreview from "../../shared/CodePreview"
import ClosingManuallyCode from "./Code/ClosingManuallyCode"


const ClosingPopoverManual = () => {
  return (
    <div>
      <CodePreview
        component={<ClosingManuallyCode />}
        filePath="src/app/components/headless-ui/Popover/Code/ClosingManuallyCode.tsx"
        title="Closing Popovers Manually"
      />
    </div>
  )
}

export default ClosingPopoverManual
