import CodePreview from '@/app/components/shared/CodePreview'
import Inputlabel from './code/InputLabelCode'

const InputWithLabel = () => {
  return (
    <CodePreview
      component={<Inputlabel />}
      filePath='src/app/components/shadcn-form/Input/code/InputLabelCode.tsx'
      title='Input With Label'
    />
  )
}

export default InputWithLabel
