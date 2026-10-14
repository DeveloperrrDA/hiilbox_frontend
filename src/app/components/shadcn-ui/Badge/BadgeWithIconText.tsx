'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import BadgeWithIcon from './code/BadgeWithIconCode'

const BadgeWithIconText = () => {
  return (
    <>
      <CodePreview
        component={<BadgeWithIcon />}
        filePath='src/app/components/shadcn-ui/Badge/code/BadgeWithIconCode.tsx'
        title='Badge With Icon Text'
      />
    </>
  )
}

export default BadgeWithIconText
