import * as React from 'react'
import CodePreview from '@/app/components/shared/CodePreview'
import Scrollableselect from './code/ScrollableSelectCode'

const ScrollableSelect = () => {
  return (
    <CodePreview
      component={<Scrollableselect />}
      filePath='src/app/components/shadcn-form/Select/code/ScrollableSelectCode.tsx'
      title='Scrollable'
    />
  )
}

export default ScrollableSelect
