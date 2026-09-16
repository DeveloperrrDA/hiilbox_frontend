import CodePreview from '@/app/components/shared/CodePreview'
import Otpinput from './code/OtpInputCode'

const OtpInput = () => {
  return (
    <CodePreview
      component={<Otpinput />}
      filePath='src/app/components/shadcn-form/Input/code/OtpInputCode.tsx'
      title='OTP Input'
    />
  )
}

export default OtpInput
