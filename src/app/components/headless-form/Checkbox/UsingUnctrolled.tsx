'use client'

import CodePreview from '../../shared/CodePreview'
import UsingUnControlledCode from './Codes/UsingUncontrolledCode'

const UsingUncontrolled = () => {
  return (
    <CodePreview
      component={<UsingUnControlledCode />}
      filePath="src/app/components/headless-form/Checkbox/Codes/UsingUncontrolledCode.tsx"
      title="Using as Uncontrolled"
    />
  )
}

export default UsingUncontrolled
