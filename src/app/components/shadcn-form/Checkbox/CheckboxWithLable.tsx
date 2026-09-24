'use client'
import React from 'react'
import CodePreview from '@/app/components/shared/CodePreview'
import Checkboxlabel from './code/CheckboxLabelCode'

const CheckboxWithLable = () => {
  return (
    <CodePreview
      component={<Checkboxlabel />}
      filePath='src/app/components/shadcn-form/Checkbox/code/CheckboxLabelCode.tsx'
      title='With Label'
    />
  )
}

export default CheckboxWithLable
