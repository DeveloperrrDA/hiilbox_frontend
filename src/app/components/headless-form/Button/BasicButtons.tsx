import CodePreview from "../../shared/CodePreview"
import BasicButtonsCode from "./Codes/BasicButtonsCode"

const BasicButtons = () => {
  return (
    <div>
      <CodePreview
        component={<BasicButtonsCode />}
        filePath="src/app/components/headless-form/Button/Codes/BasicButtonsCode.tsx"
        title="Basic Buttons"
      />
    </div>
  )
}

export default BasicButtons
