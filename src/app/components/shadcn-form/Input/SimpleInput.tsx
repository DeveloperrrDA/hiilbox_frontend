
import CodePreview from '@/app/components/shared/CodePreview'
import Simpleinput from './code/SimpleInputCode'

const SimpleInput = () => {
  return (
    <CodePreview
      component={<Simpleinput />}
      filePath='src/app/components/shadcn-form/Input/code/SimpleInputCode.tsx'
      title='General Input'
    />
  )
}

export default SimpleInput
