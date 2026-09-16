import CodePreview from '@/app/components/shared/CodePreview'
import DisableInputWithbutton from './code/DisableInputWithButtonCode'

const DisabledInput = () => {
  return (
    <CodePreview
      component={<DisableInputWithbutton />}
      filePath='src/app/components/shadcn-form/Input/code/DisableInputWithButtonCode.tsx'
      title='Disable Input'
    />
  )
}

export default DisabledInput
