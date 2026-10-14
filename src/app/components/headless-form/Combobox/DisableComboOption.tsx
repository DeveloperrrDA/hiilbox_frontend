'use client'
import CodePreview from '../../shared/CodePreview'
import DisableComboOptCode from './Codes/DisableComboOptCode'

const DisableComboOption = () => {
  return (
    <CodePreview
      component={<DisableComboOptCode />}
      filePath="src/app/components/headless-form/Combobox/Codes/DisableComboOptCode.tsx"
      title="Disabled Combo Option"
    />
  )
}

export default DisableComboOption
