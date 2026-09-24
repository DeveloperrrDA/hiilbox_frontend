import CodePreview from '@/app/components/shared/CodePreview'
import Basicprogressbar from './code/BasicProgressbarCode'

const BasicProgressbar = () => {
  return (
    <>
      <CodePreview
        component={<Basicprogressbar />}
        filePath='src/app/components/shadcn-ui/Progressbar/code/BasicDropdownCode.tsx'
        title='Basic Progress'
      />
    </>
  )
}

export default BasicProgressbar
