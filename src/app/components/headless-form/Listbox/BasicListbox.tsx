'use client'
import CodePreview from '../../shared/CodePreview'
import BasicListCode from './Codes/BasicListCode'

const BasicListbox = () => {
  return (
    <CodePreview
      component={<BasicListCode />}
      filePath="src/app/components/headless-form/Listbox/Codes/BasicListCode.tsx"
      title="Basic Listbox"
    />
  )
}

export default BasicListbox
