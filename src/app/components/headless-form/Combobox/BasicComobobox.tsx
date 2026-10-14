'use client'

import CodePreview from '../../shared/CodePreview'
import BasicComboCode from './Codes/BasicComboCode'

const BasicCombobox = () => {
  return (

    <CodePreview
          component={<BasicComboCode />}
          filePath="src/app/components/headless-form/Combobox/Codes/BasicComboCode.tsx"
          title="Basic"
        />
  )
}

export default BasicCombobox
