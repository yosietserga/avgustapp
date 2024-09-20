import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import CountryForm from '@/components/form/country'

export default async function PaisPage({ params }: { params: { id: number } }) {
  const country = await getCountryById(params.id)

  if (!country) {
    notFound()
  }

  return (
    <div>
      <h1>{country ? 'Edit Country' : 'Add New Country'}</h1>
      <CountryForm initialData={country} />
    </div>
  )
}

async function getCountryById(id: number) {
  try {
    const country = await prisma.country.findUnique({
      where: { id }
    })
    return country
  } catch (error) {
    console.error('Error fetching country:', error)
    return null
  }
}