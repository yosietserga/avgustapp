"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { MoreVertical, Edit, Trash } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { AnimatePresence, motion } from "framer-motion"
import ConfirmationModal from '@/components/form/confirm-modal'

interface Crop {
  id: number;
  name: string;
}

export default function CropList() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [cropToDelete, setCropToDelete] = useState<Crop | null>(null)

  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/crops')
      if (!response.ok) {
        throw new Error('Failed to fetch crops')
      }
      const data = await response.json()
      setCrops(data)
    } catch (error) {
      console.error("Failed to fetch crops:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (crop: Crop) => {
    setCropToDelete(crop)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!cropToDelete) return

    try {
      const response = await fetch(`/api/crops/${cropToDelete.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete crop')
      }
      setCrops(crops.filter(crop => crop.id !== cropToDelete.id))
    } catch (error) {
      console.error("Failed to delete crop:", error)
    } finally {
      setDeleteModalOpen(false)
      setCropToDelete(null)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cultivos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {crops.map((crop) => (
                <motion.tr
                  key={crop.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
                          <Link href={`/cultivos/${crop.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Ver</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/admincultivos/${crop.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeleteClick(crop)}>
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

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}