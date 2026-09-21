import CodePreview from '@/app/components/shared/CodePreview'
import Basicaccordian from './code/BasicAccordiancode'

const BasicAccordion = () => {
  return (
    <>
      <CodePreview
        component={<Basicaccordian />}
        filePath='src/app/components/shadcn-ui/Accordion/code/BasicAccordiancode.tsx'
        title='Basic Accordion'
      />
    </>
  )
}

export default BasicAccordion
