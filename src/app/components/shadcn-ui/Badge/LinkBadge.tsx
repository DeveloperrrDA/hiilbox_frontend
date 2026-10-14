import CodePreview from '@/app/components/shared/CodePreview'
import Linkbadge from './code/LinkBadgeCode'

const LinkBadge = () => {
  return (
    <>
      <CodePreview
        component={<Linkbadge />}
        filePath='src/app/components/shadcn-ui/Badge/code/LinkBadgeCode.tsx'
        title='Link Badge'
      />
    </>
  )
}

export default LinkBadge
