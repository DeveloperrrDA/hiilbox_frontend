'use client'

import CodePreview from '../../shared/CodePreview'
import ComboWithLableCode from './Codes/ComboWithLableCode'

const WithLabel = () => {
  return (
    <CodePreview
      component={<ComboWithLableCode />}
      filePath="src/app/components/headless-form/Combobox/Codes/ComboWithLableCode.tsx"
      title="With Label"
    />
  )
}

export default WithLabel
