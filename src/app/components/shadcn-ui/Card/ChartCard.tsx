import CodePreview from '@/app/components/shared/CodePreview'
import Chartcard from './code/ChartCardCode'

const ChartCard = () => {
  return (
    <>
      <CodePreview
        component={<Chartcard />}
        filePath='src/app/components/shadcn-ui/Card/code/ChartCardCode.tsx'
      />
    </>
  )
}

export default ChartCard
