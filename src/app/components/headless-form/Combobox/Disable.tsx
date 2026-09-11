'use client'
import CodePreview from '../../shared/CodePreview'
import DisabledCode from './Codes/DisabledCode'

const DisableCombo = () => {
  return (
    <CodePreview
      component={<DisabledCode />}
      filePath="src/app/components/headless-form/Combobox/Codes/DisabledCode.tsx"
      title="Disabled"
    />
  )
}

export default DisableCombo
