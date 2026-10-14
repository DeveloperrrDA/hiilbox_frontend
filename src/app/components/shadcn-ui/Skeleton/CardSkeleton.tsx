'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Cardskeleton from './code/CardSkeletonCode'

const CardSkeleton = () => {
  return (
    <>
      <CodePreview
        component={<Cardskeleton />}
        filePath='src/app/components/shadcn-ui/Skeleton/code/CardSkeletonCode.tsx'
        title='Card Skeleton'
      />
    </>
  )
}

export default CardSkeleton
