'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import BreadcrumbWithellipsis from './code/BreadcrumbWithEllipsisCode'

const BreadcrumbWithEllipsis = () => {
  return (
    <>
      <CodePreview
        component={<BreadcrumbWithellipsis />}
        filePath='src/app/components/shadcn-ui/Breadcrumb/code/BreadcrumbWithEllipsisCode.tsx'
        title='Breadcrumb Ellipsis'
      />
    </>
  )
}

export default BreadcrumbWithEllipsis
