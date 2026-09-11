'use client'

import { Textarea } from '@/components/ui/textarea'

const DefaultTextareaCode = () => {
  return (
    <>
      <div className='max-w-sm pt-4'>
        <Textarea placeholder='Type your message here.' className='h-[130px]' />
      </div>
    </>
  )
}

export default DefaultTextareaCode
