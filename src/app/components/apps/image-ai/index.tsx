'use client'
import { Activity, useContext } from 'react'
import ImagePrompt from './ImagePrompt'
import GeneratedImageDisplay from './GeneratedImageDisplay'
import DefaultImageDisplay from './DefaultImageDisplay'
import { ImageContext } from '@/app/context/ImageAiContext'
import CardBox from '../../shared/CardBox'

function ImageAiApp() {
  const { displayedImages, isGenerating } = useContext(ImageContext)

  const hasGeneratedImages = displayedImages && displayedImages.length > 0
  return (
    <CardBox>
      <div className='h-full flex flex-auto flex-col gap-5'>
        <ImagePrompt />
        <Activity
          mode={isGenerating || hasGeneratedImages ? 'visible' : 'hidden'}>
          <GeneratedImageDisplay />
        </Activity>
        <DefaultImageDisplay />
      </div>
    </CardBox>
  )
}

export default ImageAiApp
