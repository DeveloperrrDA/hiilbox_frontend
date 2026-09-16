'use client'

import TitleCard from '@/app/components/shared/TitleBorderCard'
import FileUploadMotion from '@/app/components/animatedComponents/FileUploadMotion'

const AnimatedDropzone = () => {
  return (
    <>
      <TitleCard title='Animated Dropzone'>
        <div>
          <FileUploadMotion />
        </div>
      </TitleCard>
    </>
  )
}

export default AnimatedDropzone
