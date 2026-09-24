'use client'

import CodePreview from '../../shared/CodePreview'
import ListingTabChangeCode from './Code/ListingTabChangeCode'

const ListingForChangeTab = () => {
  return (
    <div>
      <CodePreview
        component={<ListingTabChangeCode />}
        filePath="src/app/components/headless-ui/Tabs/Code/ListingTabChangeCode.tsx"
        title="Listening For Changes Tab"
      />
    </div>
  )
}

export default ListingForChangeTab
