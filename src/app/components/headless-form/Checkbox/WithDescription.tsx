'use client'

import CodePreview from '../../shared/CodePreview'
import WithdescriptionCode from './Codes/WithDescriptionCode'

const WithDescription = () => {
  return (
    <CodePreview
      component={<WithdescriptionCode />}
      filePath="src/app/components/headless-form/Checkbox/Codes/WithDescriptionCode.tsx"
      title="With Discription"
    />
  )
}

export default WithDescription
