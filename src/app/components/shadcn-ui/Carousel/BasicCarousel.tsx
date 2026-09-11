'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Basiccarousel from './code/BasicCarouselCode'

const BasicCarousel = () => {
  return (
    <>
      <CodePreview
        component={<Basiccarousel />}
        filePath='src/app/components/shadcn-ui/Carousel/code/BasicCarouselCode.tsx'
        title='Basic Carousel'
      />
    </>
  )
}

export default BasicCarousel
