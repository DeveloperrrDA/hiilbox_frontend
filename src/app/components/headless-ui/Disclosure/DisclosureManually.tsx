'use client'

import CodePreview from "../../shared/CodePreview"
import ClosingDisclosureCode from "./Code/ClosingDisclosureCode"


const DisclosureManually = () => {
  return (
    <div>
      <CodePreview
        component={<ClosingDisclosureCode />}
        filePath="src/app/components/headless-ui/Disclosure/Code/ClosingDisclosureCode.tsx"
        title="Closing Disclosures Manually"
      />
    </div>
  )
}

export default DisclosureManually
