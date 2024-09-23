import Link from 'next/link'
import { Globe, Sprout } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-100 to-green-100">
      <h1 className="text-4xl font-bold mb-12 text-gray-800">Agricultural Management System</h1>
      <div className="flex space-x-12">
        <Link href="/pais" className="flex flex-col items-center group">
          <div className="bg-blue-500 p-6 rounded-full transition-all duration-300 group-hover:bg-blue-600">
            <Globe className="h-16 w-16 text-white" />
          </div>
          <span className="mt-4 text-xl font-semibold text-gray-800 group-hover:text-blue-600">Countries</span>
        </Link>
        <Link href="/cultivos" className="flex flex-col items-center group">
          <div className="bg-green-500 p-6 rounded-full transition-all duration-300 group-hover:bg-green-600">
            <Sprout className="h-16 w-16 text-white" />
          </div>
          <span className="mt-4 text-xl font-semibold text-gray-800 group-hover:text-green-600">Crops</span>
        </Link>
      </div>
    </main>
  )
}