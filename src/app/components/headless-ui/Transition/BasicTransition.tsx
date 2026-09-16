'use client'

import CodePreview from '../../shared/CodePreview'
import BasicTransactionCode from './Codes/BasicTransactionCode'

const BasicTransition = () => {
  return (
    <div>
      <CodePreview
        component={<BasicTransactionCode />}
        filePath="src/app/components/headless-ui/Transition/Codes/BasicTransactionCode.tsx"
        title="Basic Transition"
      />
    </div>
  )
}

export default BasicTransition
