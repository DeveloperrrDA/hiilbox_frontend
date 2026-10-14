'use client'
import React from 'react'
import CodePreview from '@/app/components/shared/CodePreview'
import Disabledcheck from './code/DisabledCheckCode'

const DisabledCehckboxes = () => {
  return (
    <CodePreview
      component={<Disabledcheck />}
      filePath='src/app/components/shadcn-form/Checkbox/code/DisabledCheckCode.tsx'
      title='Disables'
    />
  )
}

export default DisabledCehckboxes
