import CodePreview from '@/app/components/shared/CodePreview'
import Formcombo from './code/FormComboCode'

const FormCombo = () => {
  return (
    <CodePreview
      component={<Formcombo />}
      filePath='src/app/components/shadcn-ui/Combobox/code/FormComboCode.tsx'
      title='Form Combobox'
    />
  )
}

export default FormCombo
