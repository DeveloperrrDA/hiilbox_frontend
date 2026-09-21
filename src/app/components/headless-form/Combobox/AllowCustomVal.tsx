'use client'

import CodePreview from '../../shared/CodePreview'
import HtmlFormsCodes from './Codes/HtmlFormsCodes'

const AllowCustomVal = () => {
  return (
    <CodePreview
          component={<HtmlFormsCodes />}
          filePath="src/app/components/headless-form/Combobox/Codes/HtmlFormsCodes.tsx"
          title="HTML Forms"
        />
  )
}

export default AllowCustomVal
