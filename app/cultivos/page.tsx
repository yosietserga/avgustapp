"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { MoreVertical, Edit, Trash } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { AnimatePresence, motion } from "framer-motion"

export default function CropList() {
  const [crops, setCrops] = useState([
    { id: 1, name: 'ARROZ' },
    { id: 2, name: 'TOMATE' },
    { id: 3, name: 'MAÍZ' },
  ])

 useEffect(() => {
    async function fetchCrops() {
      //const fetchedCrops = await getCrops()
      //setCrops(fetchedCrops)
    }
    fetchCrops()
  }, [])

  const handleDelete = (id: number) => {
    setCrops(crops.filter(crop => crop.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2c3e50] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <img src="/placeholder.svg?height=40&width=150" alt="Avgust crop protection" className="h-10" />
          <button className="text-white">
            <img src="/placeholder.svg?height=24&width=36" alt="Colombian flag" className="h-6" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis cultivos</h1>
          <Link href="/admincultivos">
            <Button className="bg-[#00bcd4] hover:bg-[#00acc1] text-white">
              + Crear cultivo
            </Button>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Cultivos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {crops.map((crop) => (
                  <motion.tr
                    key={crop.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {crop.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/crop-management?id=${crop.id}`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDelete(crop.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2c3e50] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/placeholder.svg?height=40&width=150" alt="Avgust crop protection" className="h-10 mb-4" />
              <p className="text-sm">
                Avgust Colombia es una empresa comprometida en brindar a los agricultores colombianos soluciones que permitan la protección integral de sus cultivos.
              </p>
              <address className="mt-4 text-sm">
                Av. Carrera 45 #108-27 Torre 2<br />
                Oficina 905, Centro Empresarial<br />
                Paralelo 108, Bogotá, Colombia
              </address>
              <p className="mt-2 text-sm">
                Teléfono: +57 310 451 3336<br />
                +57 601 4841723
              </p>
              <p className="mt-2 text-sm">
                E-mail: contacto@avgust.com.co
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Nosotros</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Quienes somos</a></li>
                <li><a href="#" className="hover:underline">Nuestra Historia</a></li>
                <li><a href="#" className="hover:underline">Valores</a></li>
                <li><a href="#" className="hover:underline">Ética empresarial</a></li>
                <li><a href="#" className="hover:underline">Política de privacidad</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Productos</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Insecticidas</a></li>
                <li><a href="#" className="hover:underline">Fungicidas</a></li>
                <li><a href="#" className="hover:underline">Herbicidas</a></li>
                <li><a href="#" className="hover:underline">Nutrición</a></li>
                <li><a href="#" className="hover:underline">Feromonas</a></li>
                <li><a href="#" className="hover:underline">Otros Insumos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Cultivos</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Arroz</a></li>
                <li><a href="#" className="hover:underline">Aguacate</a></li>
                <li><a href="#" className="hover:underline">Papa</a></li>
                <li><a href="#" className="hover:underline">Hortalizas</a></li>
                <li><a href="#" className="hover:underline">Banano y Plátano</a></li>
                <li><a href="#" className="hover:underline">Frutales</a></li>
                <li><a href="#" className="hover:underline">Ornamentales</a></li>
                <li><a href="#" className="hover:underline">Caña</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-between items-center">
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-[#8bc34a] hover:bg-[#7cb342] text-white">
                Calcula tu Huella de Carbono
              </Button>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-wrap justify-between items-center">
            <p className="text-sm">Copyright © 2023. Todos los derechos reservados</p>
            <div className="mt-4 md:mt-0">
              <Input type="text" placeholder="Buscar" className="bg-gray-700 text-white" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}