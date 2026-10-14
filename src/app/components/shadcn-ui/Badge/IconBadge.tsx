'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import IconBadge from './code/IconBadgeCode'

const Iconbadge = () => {
  return (
    <>
      <CodePreview
        component={<IconBadge />}
        filePath='src/app/components/shadcn-ui/Badge/code/IconBadgeCode.tsx'
        title='Icon Badge'
      />
    </>
  )
}

export default Iconbadge
