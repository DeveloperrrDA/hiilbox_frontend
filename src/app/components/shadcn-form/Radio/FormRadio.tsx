'use client'
import React from 'react'
import CodePreview from '@/app/components/shared/CodePreview'
import Formradio from './code/FormRadioCode'

const FormRadio = () => {
  return (
    <CodePreview
      component={<Formradio />}
      filePath='src/app/components/shadcn-form/Radio/code/FormRadioCode.tsx'
      title='Form Radio Group'
    />
  )
}

export default FormRadio
