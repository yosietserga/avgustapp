'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/form/confirm-modal'

type Country = {
  id: number
  nombre: string
  code: string
}

type CountryListProps = {
  countries: Country[]
}

export function CountryList({ countries }: CountryListProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [countryToDelete, setCountryToDelete] = useState<number | null>(null)
  
  const router = useRouter()

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/countries/${id}`, { method: 'DELETE' })
      if (response.ok) {
        router.refresh()
      } else {
        console.error('Failed to delete country')
      }
    } catch (error) {
      console.error('Error deleting country:', error)
    }
  }

  const openConfirmModal = (id: number) => {
    setCountryToDelete(id)
    setShowConfirmModal(true)
  }

  const closeConfirmModal = () => {
    setShowConfirmModal(false)
    setCountryToDelete(null)
  }

  const confirmDelete = () => {
    if (countryToDelete) {
      handleDelete(countryToDelete)
      closeConfirmModal()
    }
  }

  return (
    <div className="relative">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.id} className="hover:bg-gray-100">
              <td className="border p-2">{country.nombre}</td>
              <td className="border p-2">{country.code}</td>
              <td className="border p-2">
                <div className="flex justify-center space-x-2">
                  <Link href={`/pais/${country.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
                    Edit
                  </Link>
                  <button 
                    onClick={() => openConfirmModal(country.id)} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={confirmDelete}
      />
    </div>
  )
}