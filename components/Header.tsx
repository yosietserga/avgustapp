import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <>
    {/** 
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-gray-900">Avgust</span>
            </Link>
            <nav className="hidden md:flex ml-10 space-x-4">
              <Link href="/productos" className="text-gray-500 hover:text-gray-900">Productos</Link>
              <Link href="/cultivos" className="text-gray-500 hover:text-gray-900">Cultivos</Link>
              <Link href="/nosotros" className="text-gray-500 hover:text-gray-900">Nosotros</Link>
              <Link href="/noticias" className="text-gray-500 hover:text-gray-900">Noticias</Link>
              <Link href="/contacto" className="text-gray-500 hover:text-gray-900">Contacto</Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
              ES
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
    */}
    </>
  )
}