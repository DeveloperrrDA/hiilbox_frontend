import CodePreview from '@/app/components/shared/CodePreview'
import CarouselMultipleitem from './code/CarouselMultipleItemCode'

const CarouselWithultipleItem = () => {
  return (
    <>
      <CodePreview
        component={<CarouselMultipleitem />}
        filePath='src/app/components/shadcn-ui/Carousel/code/CarouselMultiItemCode.tsx'
        title='Carousel With Multiple Item'
      />
    </>
  )
}

export default CarouselWithultipleItem
