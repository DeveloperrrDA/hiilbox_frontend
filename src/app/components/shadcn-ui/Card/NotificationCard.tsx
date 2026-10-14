import CodePreview from '@/app/components/shared/CodePreview'
import Notificationcard from './code/NotificationCardCode'

const NotificationCard = () => {
  return (
    <>
      <CodePreview
        component={<Notificationcard />}
        filePath='src/app/components/shadcn-ui/Card/code/NotificationCardCode.tsx'
      />
    </>
  )
}

export default NotificationCard
