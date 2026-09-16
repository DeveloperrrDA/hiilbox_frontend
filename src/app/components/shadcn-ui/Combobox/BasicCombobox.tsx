import CodePreview from '@/app/components/shared/CodePreview'
import Basiccombobox from './code/BasicComboCode'

const BasicCombobox = () => {
  return (
    <>
      <CodePreview
        component={<Basiccombobox />}
        filePath='src/app/components/shadcn-ui/Combobox/code/BasicComboCode.tsx'
        title='Basic Combobox'
      />
    </>
  )
}

export default BasicCombobox
