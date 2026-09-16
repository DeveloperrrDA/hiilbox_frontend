'use client'

import CodePreview from '../../shared/CodePreview'
import FramerMotionCode from './Code/FramerMotionCode'

const FramerDiclosure = () => {
  return (
    <div>
      <CodePreview
        component={<FramerMotionCode />}
        filePath="src/app/components/headless-ui/Disclosure/Code/FramerMotionCode.tsx"
        title="Disclosure With Framer Motion"
      />
    </div>
  )
}

export default FramerDiclosure
