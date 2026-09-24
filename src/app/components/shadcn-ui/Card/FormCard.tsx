'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import FormCardInfo from './code/FormCardCode'

const FormCard = () => {
  return (
    <>
      <CodePreview
        component={<FormCardInfo />}
        filePath='src/app/components/shadcn-ui/Card/code/FormCardCode.tsx'
      />
    </>
  )
}

export default FormCard
