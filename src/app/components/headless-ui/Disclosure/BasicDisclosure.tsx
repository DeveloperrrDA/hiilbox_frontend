'use client'

import CodePreview from "../../shared/CodePreview"
import BasicDisclosureCode from "./Code/BasicDisclosureCode"

const BasicDisclosure = () => {
  return (
    <div>
      <CodePreview
        component={<BasicDisclosureCode />}
        filePath="src/app/components/headless-ui/Disclosure/Code/BasicDisclosureCode.tsx"
        title="Basic Disclosure"
      />
    </div>
  )
}

export default BasicDisclosure
