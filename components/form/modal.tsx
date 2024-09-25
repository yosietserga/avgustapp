import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload } from 'lucide-react'
import NextImage from 'next/image'

interface FieldsFormModalProps {
  description: boolean
  icon: boolean
}

interface FormModalProps {
  title?: string
  isOpen?: boolean
  fields: FieldsFormModalProps
  onClose: () => void
  onSubmit: (data: FormData) => void
  onUpload?: (file: File) => Promise<string>
  triggerButton?: React.ReactNode; // New prop for custom trigger button
}

type FormData = {
  name: string;
  icon?: string;
  description?: string;
  objectiveId?: number;
  cropId?: number;
  order?: number;
};

export default function FormModal({ title, isOpen, onClose, onSubmit, onUpload, fields, triggerButton }: FormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [icon, setIcon] = useState<string>("")
  const [errors, setErrors] = useState<{ name?: string, icon?: string }>({})
  const [isUploading, setIsUploading] = useState(false);
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

  const handleImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const error = validateImage(file)
      if (error) {
        setErrors((prev) => ({ ...prev, icon: error }))
        return
      }
      try {
        setIsUploading(true);
        if (typeof onUpload === 'function') {
          const uploadedPath = await onUpload(file);
          setImage(file);
          setIcon(uploadedPath);
          setErrors((prev) => ({ ...prev, icon: undefined }));
        } else {
          throw new Error('onUpload is not a function');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setErrors((prev) => ({ ...prev, icon: 'Error uploading file. Please try again.' }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImage(null)
      setIcon('')
      setErrors((prev) => ({ ...prev, icon: undefined }))
      return
    }

    const error = validateImage(file)
    if (error) {
      setErrors((prev) => ({ ...prev, icon: error }))
      return
    }

    const img = new window.Image()
    img.onload = () => {
      if (img.width !== 400 || img.height !== 400) {
        setErrors((prev) => ({ ...prev, icon: 'La imagen debe ser de 400x400 píxeles.' }))
      } else {
        setImage(file)
        handleImageDrop([file])
      }
    }
    img.onerror = () => {
      setErrors((prev) => ({ ...prev, icon: 'No se pudo cargar la imagen.' }))
    }
    img.src = URL.createObjectURL(file)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { name?: string, icon?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Este campo es obligatorio'
    }

    if (fields.icon && !icon) {
      newErrors.icon = 'Please upload an icon';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formData: FormData = { name };

    if (fields.icon && icon) {
      formData.icon = icon;
    }
    if (fields.description) {
      formData.description = description ?? "";
    }
    console.log(formData);
    onSubmit(formData);
    onClose()

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        {triggerButton || <Button variant="outline">Abrir Formulario</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title ?? "Crear/Editar Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label htmlFor="name">Título:</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe el nombre de la etapa"
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>
          
          {fields?.description && (
            <div>
            <Label htmlFor="description">Descripción:</Label>
            <Textarea 
              id="description" 
              placeholder="escribe información relevante para enseñar" 
              className="h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          )}
          {fields.icon && (
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
            Icon
          </label>
          <div className="mt-1 flex items-center">
            {icon ? (
              <NextImage src={icon} width={48} height={48} alt="Uploaded icon" className="h-12 w-12 object-cover rounded-full" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            )}
            <button
              type="button"
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleImageChange(e.target.files[0]);
              }
            }}
          />
          {errors.icon && <p className="mt-2 text-sm text-red-600">{errors.icon}</p>}
          {isUploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
        </div>
      )}

          <Button type="submit" className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white">
            Guardar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}