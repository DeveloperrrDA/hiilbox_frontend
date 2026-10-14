'use client'

import CodePreview from "../../shared/CodePreview"
import RenderDiclosureCode from "./Code/RenderDiclosureCode"

const RenderingDisclosure = () => {
  return (
    <div>
      <CodePreview
        component={<RenderDiclosureCode />}
        filePath="src/app/components/headless-ui/Disclosure/Code/RenderDiclosureCode.tsx"
        title="Rendering As Different Elements"
      />
    </div>
  )
}

export default RenderingDisclosure
