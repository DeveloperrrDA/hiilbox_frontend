import Image from 'next/image'
import CardBox from '@/app/components/shared/CardBox'

const photos = [
  {
    cardimage: '/images/profile/user-2.jpg',
    id: 1,
  },
  {
    cardimage: '/images/profile/user-3.jpg',
    id: 2,
  },
  {
    cardimage: '/images/profile/user-4.jpg',
    id: 3,
  },
  {
    cardimage: '/images/profile/user-5.jpg',
    id: 4,
  },
  {
    cardimage: '/images/profile/user-6.jpg',
    id: 5,
  },
  {
    cardimage: '/images/profile/user-7.jpg',
    id: 6,
  },
  {
    cardimage: '/images/profile/user-8.jpg',
    id: 7,
  },
  {
    cardimage: '/images/profile/user-9.jpg',
    id: 8,
  },
  {
    cardimage: '/images/profile/user-10.jpg',
    id: 9,
  },
]

const Photos = () => {
  return (
    <>
      <CardBox>
        <h5 className="card-title mb-2">Photos</h5>
        <div className="grid grid-cols-12 gap-5">
          {photos.map((photo) => (
            <div key={photo.id} className="md:col-span-4 sm:col-span-6 col-span-4">
              <Image src={photo.cardimage} alt="profile" className="rounded-md w-full" width={100} height={100} />
            </div>
          ))}
        </div>
      </CardBox>
    </>
  )
}

export default Photos
