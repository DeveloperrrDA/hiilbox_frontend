'use client'

import CodePreview from "../../shared/CodePreview"
import EnterLeaveTransitionCode from "./Codes/EnterLeaveTransitionCode"


const EnterLeaveTransition = () => {
  return (
    <div>
      <CodePreview
        component={<EnterLeaveTransitionCode />}
        filePath="src/app/components/headless-ui/Transition/Codes/EnterLeaveTransitionCode.tsx"
        title="Different Transition"
      />
    </div>
  )
}

export default EnterLeaveTransition
