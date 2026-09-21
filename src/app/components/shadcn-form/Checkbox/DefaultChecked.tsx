'use client'
import React from 'react'
import CodePreview from '@/app/components/shared/CodePreview'
import DefaultCheck from './code/DefaultCheckCode'

const DefaultChecked = () => {
  return (
    <CodePreview
      component={<DefaultCheck />}
      filePath='src/app/components/shadcn-form/Checkbox/code/DefaultCheckCode.tsx'
      title='Default Checked'
    />
  )
}

export default DefaultChecked
