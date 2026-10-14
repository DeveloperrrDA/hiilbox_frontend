import CodePreview from '@/app/components/shared/CodePreview'
import Outlinebadge from './code/OutlineBadgeCode'

const OutlineBadge = () => {
  return (
    <>
      <CodePreview
        component={<Outlinebadge />}
        filePath='src/app/components/shadcn-ui/Badge/code/OutlineBadgeCode.tsx'
        title='Outline Badge'
      />
    </>
  )
}

export default OutlineBadge
