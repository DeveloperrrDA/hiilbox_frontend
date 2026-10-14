'use client'

import CodePreview from "../../shared/CodePreview"
import TransitionCode from "./Code/TransitionCode"

const TransitionDisclosure = () => {
  return (
    <div>
      <CodePreview
        component={<TransitionCode />}
        filePath="src/app/components/headless-ui/Disclosure/Code/TransitionCode.tsx"
        title="Transitions Disclosure"
      />
    </div>
  )
}

export default TransitionDisclosure
