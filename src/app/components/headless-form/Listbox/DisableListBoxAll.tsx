'use client'

import CodePreview from '../../shared/CodePreview'
import DisableListboxCode from './Codes/DisableListboxCode'

const DisableListAll = () => {
  return (
    <CodePreview
      component={<DisableListboxCode />}
      filePath="src\app\components\headless-form\Listbox\Codes\DisableListboxCode.tsx"
      title="Disable Listbox"
    />
  )
}

export default DisableListAll
