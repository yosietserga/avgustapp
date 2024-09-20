'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CountryFormProps {
  initialData?: {
    id: number
    nombre: string
    code: string
  }
}

export default function CountryForm({ initialData }: CountryFormProps) {
  const router = useRouter()
  const [nombre, setNombre] = useState(initialData?.nombre || '')
  const [code, setCode] = useState(initialData?.code || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const url = initialData ? `/api/countries/${initialData.id}` : '/api/countries'
    const method = initialData ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, code }),
      })

      if (response.ok) {
        router.push('/pais')
        router.refresh()
      } else {
        console.error('Error saving country')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-700">
          Country Name
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Enter country name"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-700">
          Country Code
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Enter country code"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
          isSubmitting
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        }`}
      >
        {isSubmitting ? 'Submitting...' : initialData ? 'Update Country' : 'Add Country'}
      </button>
    </form>
  )
}