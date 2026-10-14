'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basictooltip from './code/BasicTooltipCode'

const BasicTooltip = () => {
  return (
    <>
      <CodePreview
        component={<Basictooltip />}
        filePath='src/app/components/shadcn-ui/Tooltip/code/BasicTooltipCode.tsx'
        title='Basic Tooltip'
      />
    </>
  )
}

export default BasicTooltip
