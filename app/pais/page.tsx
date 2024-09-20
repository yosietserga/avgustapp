import prisma from '@/lib/prisma'
import Link from 'next/link'
import { CountryList } from '@/components/CountryList'

export default async function PaisPage() {
  const countries = await getCountries()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Countries</h1>
      <Link href="/pais/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        Add New Country
      </Link>
      <CountryList countries={countries} />
    </div>
  )
}

async function getCountries() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { nombre: 'asc' },
    })
    return countries
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}