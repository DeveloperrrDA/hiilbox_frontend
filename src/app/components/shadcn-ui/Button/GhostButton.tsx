'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Ghostbutton from './code/GhostButtonCode'

const GhostButton = () => {
  return (
    <>
      <CodePreview
        component={<Ghostbutton />}
        filePath='src/app/components/shadcn-ui/Button/code/GhostButtonCode.tsx'
        title='Ghost Button'
      />
    </>
  )
}

export default GhostButton
