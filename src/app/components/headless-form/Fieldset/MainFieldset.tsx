import CodePreview from '../../shared/CodePreview'
import FieldsetCode from './Codes/FieldsetCode'

const MainFieldset = () => {
  return (
    <CodePreview
          component={<FieldsetCode />}
          filePath="src/app/components/headless-form/Fieldset/Codes/FieldsetCode.tsx"
          title="Fieldset Form"
        />
  )
}

export default MainFieldset
