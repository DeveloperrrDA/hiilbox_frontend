'use client'

import CodePreview from '../../shared/CodePreview'
import ListBoxWithHtmlCode from './Codes/ListBoxWithHtmlCode'

const ListBoxWithHtmlForm = () => {
  return (
    <CodePreview
      component={<ListBoxWithHtmlCode />}
      filePath="src\app\components\headless-form\Listbox\Codes\ListBoxWithHtmlCode.tsx"
      title="Using HTML forms"
    />
  )
}

export default ListBoxWithHtmlForm
