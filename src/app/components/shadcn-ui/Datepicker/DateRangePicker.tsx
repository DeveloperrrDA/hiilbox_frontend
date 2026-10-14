'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Rangedatepicker from './code/DateRangePickerCode'

const DateRangePicker = () => {
  return (
    <>
      <CodePreview
        component={<Rangedatepicker />}
        filePath='src/app/components/shadcn-ui/Datepicker/code/DateRangePickerCode.tsx'
        title='Date Range Picker'
      />
    </>
  )
}

export default DateRangePicker
