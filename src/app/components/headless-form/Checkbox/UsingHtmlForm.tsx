'use client'

import CodePreview from '../../shared/CodePreview'
import UsingHtmlformCode from './Codes/UsingHtmlFormCode'

const UsingHtmlForm = () => {
  return (
    <CodePreview
            component={<UsingHtmlformCode />}
            filePath="src/app/components/headless-form/Checkbox/Codes/UsingHtmlFormCode.tsx"
            title="With HTML Forms"
          />
  )
}

export default UsingHtmlForm
