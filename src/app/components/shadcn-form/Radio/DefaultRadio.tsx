import * as React from 'react'
import CodePreview from '@/app/components/shared/CodePreview'
import Defaultradio from './code/DefaultRadioCode'

const DefaultRadio = () => {
  return (
    <CodePreview
      component={<Defaultradio />}
      filePath='src/app/components/shadcn-form/Radio/code/DefaultRadioCode.tsx'
      title='Default Radio Group'
    />
  )
}

export default DefaultRadio
