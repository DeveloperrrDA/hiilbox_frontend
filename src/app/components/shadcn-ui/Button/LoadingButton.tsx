'use client'

import CodePreview from '@/app/components/shared/CodePreview'
import Loadingbutton from './code/LoadingButtonCode'

const LoadingButton = () => {
  return (
    <>
      <CodePreview
        component={<Loadingbutton />}
        filePath='src/app/components/shadcn-ui/Button/code/LoadingButtonCode.tsx'
        title='Loading Button'
      />
    </>
  )
}

export default LoadingButton
