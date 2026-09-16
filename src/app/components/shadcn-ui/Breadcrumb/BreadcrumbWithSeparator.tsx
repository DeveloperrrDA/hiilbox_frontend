'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import BreadcrumbWithseparator from './code/BreadcrumbWithSeparatorCode'

const BreadcrumbWithSeparator = () => {
  return (
    <>
      <CodePreview
        component={<BreadcrumbWithseparator />}
        filePath='src/app/components/shadcn-ui/Breadcrumb/code/BreadcrumbWithSeparatorCode.tsx'
        title='Breadcrumb With Custom Separator'
      />
    </>
  )
}

export default BreadcrumbWithSeparator
