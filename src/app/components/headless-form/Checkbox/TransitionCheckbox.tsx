'use client'
import CodePreview from '../../shared/CodePreview'
import TransitioncheckCode from './Codes/TransitionCheckCode'

const TransitionCheckbox = () => {
  return (
    <CodePreview
            component={<TransitioncheckCode />}
            filePath="src/app/components/headless-form/Checkbox/Codes/TransitionCheckCode.tsx"
            title="Transitions Checkbox"
          />
  )
}

export default TransitionCheckbox
