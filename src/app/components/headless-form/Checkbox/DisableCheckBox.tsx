'use client'

import CodePreview from '../../shared/CodePreview'
import DisableCheckCode from './Codes/DisableCheckCode'

const DisableCheckBox = () => {
  return (
    <CodePreview
        component={<DisableCheckCode />}
        filePath="src/app/components/headless-form/Checkbox/Codes/DisableCheckCode.tsx"
        title="Disable Checkbox"
      />
  )
}

export default DisableCheckBox
