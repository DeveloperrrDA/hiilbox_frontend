import * as React from 'react'
import CodePreview from '@/app/components/shared/CodePreview'
import Defaultselect from './code/DefaultSelectCode'

const DefaultSelect = () => {
  return (
    <CodePreview
      component={<Defaultselect />}
      filePath='src/app/components/shadcn-form/Select/code/DefaultSelectCode.tsx'
      title='Default'
    />
  )
}

export default DefaultSelect
