'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basicskeleton from './code/BasicSkeletonCode'

const BasicSkeleton = () => {
  return (
    <>
      <CodePreview
        component={<Basicskeleton />}
        filePath='src/app/components/shadcn-ui/Skeleton/code/BasicSkeletonCode.tsx'
        title='Basic Skeleton'
      />
    </>
  )
}

export default BasicSkeleton
