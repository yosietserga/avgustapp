import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload } from 'lucide-react'

interface StageFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string, image: File | null }) => void
}

export default function StageFormModal({ isOpen, onClose, onSubmit }: StageFormModalProps) {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ title?: string, image?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateImage = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'El archivo debe ser una imagen.'
    }
    if (file.size > 200 * 1024 * 1024) {
      return 'La imagen excede el límite del tamaño permitido (recuerde que el formato es jpg máximo 200 Mb)'
    }
    return null
  }

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImage(null)
      setErrors((prev) => ({ ...prev, image: undefined }))
      return
    }

    const error = validateImage(file)
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }))
      return
    }

    const img = new Image()
    img.onload = () => {
      if (img.width !== 400 || img.height !== 400) {
        setErrors((prev) => ({ ...prev, image: 'La imagen debe ser de 400x400 píxeles.' }))
      } else {
        setImage(file)
        setErrors((prev) => ({ ...prev, image: undefined }))
      }
    }
    img.onerror = () => {
      setErrors((prev) => ({ ...prev, image: 'No se pudo cargar la imagen.' }))
    }
    img.src = URL.createObjectURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleImageChange(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { title?: string, image?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Este campo es obligatorio'
    }

    if (!image) {
      newErrors.image = 'Debe agregar una imagen'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({ title, image })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Etapa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título:</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe el nombre de la etapa"
            />
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>
          <div>
            <Label>Agregar imagen:</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <div className="text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-2" />
                  <p>Agrega el icono de la etapa</p>
                  <p className="text-sm">400 píxeles * 400 píxeles</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                capture="environment"
              />
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.image}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white">
            Crear Etapa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}