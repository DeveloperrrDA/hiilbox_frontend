'use client'

import CodePreview from "../../shared/CodePreview"
import IntialTransitionCode from "./Codes/IntialTransitionCode"

const OnIntialAmmount = () => {
  return (
    <div>
      <CodePreview
        component={<IntialTransitionCode />}
        filePath="src/app/components/headless-ui/Transition/Codes/IntialTransitionCode.tsx"
        title="Transitioning On Initial Mount"
      />
    </div>
  )
}

export default OnIntialAmmount
