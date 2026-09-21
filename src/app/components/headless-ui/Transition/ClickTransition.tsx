'use client'

import CodePreview from "../../shared/CodePreview"
import ClickTransitionCode from "./Codes/ClickTransitionCode"

const ClickTransition = () => {
  return (
    <div>
      <CodePreview
              component={<ClickTransitionCode />}
              filePath="src/app/components/headless-ui/Transition/Codes/ClickTransitionCode.tsx"
              title="Click To Transition"
            />
    </div>
  )
}
export default ClickTransition
