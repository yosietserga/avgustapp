import { notFound } from 'next/navigation'
import CropManagementPage from '@/components/CropManagementPage'
import { getCropData } from '@/lib/api'

export default async function CropPage({ params }: { params: { crop: string } }) {
  const cropData = await getCropData(parseFloat(params.crop))

  if (!cropData) {
    notFound()
  }

  return <CropManagementPage crop={cropData} />
}