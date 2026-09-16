import CodePreview from '@/app/components/shared/CodePreview'
import DefaultTextareaCode from './code/DefaultTextareaCode'

const DefaultTextarea = () => {
  return (
    <>
      <CodePreview
        component={<DefaultTextareaCode />}
        filePath='src/app/components/shadcn-form/Input/code/DefaultTextareaCode.tsx'
        title='Default Textarea'
      />
    </>
  )
}

export default DefaultTextarea
