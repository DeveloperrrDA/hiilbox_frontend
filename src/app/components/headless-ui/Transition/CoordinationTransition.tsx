'use client'

import CodePreview from "../../shared/CodePreview"
import CoordinationCode from "./Codes/CoordinationCode"


const CoordinationTransition = () => {
  return (
    <div>
      <CodePreview
        component={<CoordinationCode />}
        filePath="src/app/components/headless-ui/Transition/Codes/CoordinationCode.tsx"
        title="Coordinating Transition"
      />
    </div>
  )
}

export default CoordinationTransition
