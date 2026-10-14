import CodePreview from '@/app/components/shared/CodePreview'
import Defaultbadge from './code/DefaultBadgeCode'

const DefaultBadge = () => {
  return (
    <>
      <CodePreview
        component={<Defaultbadge />}
        filePath='src/app/components/shadcn-ui/Badge/code/DefaultBadgeCode.tsx'
        title='Default Badge'
      />
    </>
  )
}

export default DefaultBadge
