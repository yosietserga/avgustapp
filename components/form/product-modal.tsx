import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'

export default function ProductFormModal() {
  const [stages, setStages] = useState([{ start: '', startPercentage: '', end: '', endPercentage: '' }])

  const addStage = () => {
    setStages([...stages, { start: '', startPercentage: '', end: '', endPercentage: '' }])
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir Formulario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="title">Título:</Label>
            <Input id="title" placeholder="Escribe el nombre de Producto" />
          </div>
          <div>
            <Label htmlFor="description">Descripción:</Label>
            <Textarea 
              id="description" 
              placeholder="escribe información relevante para enseñar el fenograma" 
              className="h-24"
            />
          </div>
          <div>
            <Label>Selecciona un producto para relacionar su link</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto para relacionar su link" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="afinnex">AFINNEX 400 EC</SelectItem>
                <SelectItem value="irkut">IRKUT EC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {stages.map((stage, index) => (
            <div key={index} className="flex items-end space-x-2">
              <div className="flex-1">
                <Label>Etapa inicio</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Etapa inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stage1">Etapa 1</SelectItem>
                    <SelectItem value="stage2">Etapa 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Label>%</Label>
                <Input type="number" placeholder="100%" />
              </div>
              <div className="flex-1">
                <Label>Etapa fin</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Etapa fin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stage1">Etapa 1</SelectItem>
                    <SelectItem value="stage2">Etapa 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Label>%</Label>
                <Input type="number" placeholder="20%" />
              </div>
              {index === stages.length - 1 && (
                <Button type="button" onClick={addStage} size="icon" className="bg-[#00bcd4] text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <div className="pt-4 text-right">
            <Button type="submit" className="bg-[#8bc34a] text-white hover:bg-[#7cb342]">
              Crear Producto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}