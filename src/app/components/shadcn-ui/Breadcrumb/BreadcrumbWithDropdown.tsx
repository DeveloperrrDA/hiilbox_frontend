'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import BreadcrumbwithDropdown from './code/BreadcrumbWithDropdownCode'

const BreadcrumbWithDropdown = () => {
  return (
    <>
      <CodePreview
        component={<BreadcrumbwithDropdown />}
        filePath='src/app/components/shadcn-ui/Breadcrumb/code/BreadcrumbWithDropdownCode.tsx'
        title='Breadcrumb With Dropdown'
      />
    </>
  )
}

export default BreadcrumbWithDropdown
