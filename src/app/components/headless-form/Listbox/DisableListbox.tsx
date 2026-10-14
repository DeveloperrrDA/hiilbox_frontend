'use client'

import CodePreview from '../../shared/CodePreview'
import DisableListboxOptionCode from './Codes/DisableListboxOptionCode'

const DisableListBox = () => {
  return (
    <CodePreview
          component={<DisableListboxOptionCode />}
          filePath="src/app/components/headless-form/Listbox/Codes/DisableListboxOptionCode.tsx"
          title="Disable Listbox Option"
        />
  )
}

export default DisableListBox
