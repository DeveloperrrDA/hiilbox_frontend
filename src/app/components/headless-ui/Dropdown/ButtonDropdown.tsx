'use client'

import CodePreview from "../../shared/CodePreview"
import ButtonActionCode from "./Codes/ButtonActionCode"


const ButtonDropdown = () => {
  return (
    <div>
      <CodePreview
        component={<ButtonActionCode />}
        filePath="src/app/components/headless-ui/Dropdown/Codes/ButtonActionCode.tsx"
        title="Button Action"
      />
    </div>
  )
}

export default ButtonDropdown
