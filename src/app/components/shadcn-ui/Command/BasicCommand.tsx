'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basiccommand from './code/BasicCommandCode'

const BasicCommand = () => {
  return (
    <div>
      <CodePreview
        component={<Basiccommand />}
        filePath='src/app/components/shadcn-ui/Command/code/BasicCommandCode.tsx'
        title='Basic Combobox'
      />
    </div>
  )
}

export default BasicCommand
