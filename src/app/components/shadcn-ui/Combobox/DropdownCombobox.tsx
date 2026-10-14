import CodePreview from '@/app/components/shared/CodePreview'
import DropdownCombo from './code/DropdownComboCode'

const DropdownCombobox = () => {
  return (
    <>
      <CodePreview
        component={<DropdownCombo />}
        filePath='src/app/components/shadcn-ui/Combobox/code/DropdownComboCode.tsx'
        title='Dropdown Combobox'
      />
    </>
  )
}

export default DropdownCombobox
