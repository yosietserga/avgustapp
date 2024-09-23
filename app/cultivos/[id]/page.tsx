import { notFound } from 'next/navigation'
import CropManagementPlan from '@/components/CropManagementPlan'

export default async function CropPage({ params }: { params: { id: number } }) {
  const cropId = params.id

  if (!cropId) {
    notFound()
  }

  return <CropManagementPlan cropId={cropId} />
}