import CodePreview from '@/app/components/shared/CodePreview'
import Formselect from './code/FormSelectCode'

const FormSelect = () => {
  return (
    <CodePreview
      component={<Formselect />}
      filePath='src/app/components/shadcn-form/Select/code/FormSelectCode.tsx'
      title='Form Select'
    />
  )
}

export default FormSelect
