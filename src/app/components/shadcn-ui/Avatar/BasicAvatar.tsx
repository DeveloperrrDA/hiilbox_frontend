'use client'

import Basicavatar from './code/BasicAvatarCode'
import CodePreview from '@/app/components/shared/CodePreview'

const BasicAvatar = () => {
  return (
    <>
      <CodePreview
        component={<Basicavatar />}
        filePath='src/app/components/shadcn-ui/Avatar/code/BasicAvatarCode.tsx'
        title='Avatar'
      />
    </>
  )
}

export default BasicAvatar
