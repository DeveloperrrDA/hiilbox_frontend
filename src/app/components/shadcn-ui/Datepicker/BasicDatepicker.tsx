'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basicdatepicker from './code/BasicDatepickerCode'

const BasicDatepicker = () => {
  return (
    <>
      <CodePreview
        component={<Basicdatepicker />}
        filePath='src/app/components/shadcn-ui/Datepicker/code/BasicDatepickerCode.tsx'
        title='Basic Datepicker'
      />
    </>
  )
}

export default BasicDatepicker
