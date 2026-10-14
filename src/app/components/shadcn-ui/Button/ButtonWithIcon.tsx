import CodePreview from '@/app/components/shared/CodePreview'
import ButtonWithicon from './code/ButtonWithIconCode'

const ButtonWithIcon = () => {
  return (
    <>
      <CodePreview
        component={<ButtonWithicon />}
        filePath='src/app/components/shadcn-ui/Button/code/ButtonWithIconCode.tsx'
        title='Button With Icon'
      />
    </>
  )
}

export default ButtonWithIcon
