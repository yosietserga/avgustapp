import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Objective } from '@/types'

export default function ObjectiveForm({ onAddObjective }: { onAddObjective: (objective: Objective) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newObjective: Objective = {
      id: Date.now().toString(),
      title,
      image,
      stages: [],
      segments: []
    }
    onAddObjective(newObjective)
    setIsOpen(false)
    setTitle('')
    setImage('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Crear objetivo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo objetivo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="image">Imagen URL</Label>
            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} required />
          </div>
          <Button type="submit">Crear objetivo</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}