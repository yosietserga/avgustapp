import Image from 'next/image'
import { Crop } from '@/types'

export default function CropBanner({ crop }: { crop: Crop }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{crop.title}</h1>
        <p className="text-gray-600">{crop.description}</p>
      </div>
      <Image src={crop.image} alt={crop.title} width={200} height={200} className="rounded-lg" />
    </div>
  )
}