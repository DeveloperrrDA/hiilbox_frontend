import CodePreview from '@/app/components/shared/CodePreview'
import Verticalcarousel from './code/VerticalCarouselCode'

export function VerticalCarousel() {
  return (
    <>
      <CodePreview
        component={<Verticalcarousel />}
        filePath='src/app/components/shadcn-ui/Carousel/code/VerticalCarouselCode.tsx'
        title='Vertical Carousel'
      />
    </>
  )
}
