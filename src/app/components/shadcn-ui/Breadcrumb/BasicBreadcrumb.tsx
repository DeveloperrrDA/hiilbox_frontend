'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basicbreadcrumb from './code/BasicBreadcrumbCode'

const BasicBreadcrumb = () => {
  return (
    <>
      <CodePreview
        component={<Basicbreadcrumb />}
        filePath='src/app/components/shadcn-ui/Breadcrumb/code/BasicBreadcrumbCode.tsx'
        title='Basic Breadcrumb'
      />
    </>
  )
}

export default BasicBreadcrumb
