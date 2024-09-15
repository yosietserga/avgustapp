import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Objective, Stage, Segment, Product } from '@/types'

export default function TimelineView({ objective }: { objective: Objective }) {
  const [stages, setStages] = useState<Stage[]>(objective.stages)
  const [segments, setSegments] = useState<Segment[]>(objective.segments)
  const [newStage, setNewStage] = useState('')
  const [newSegment, setNewSegment] = useState('')
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)
  const [newProduct, setNewProduct] = useState('')

  const handleAddStage = () => {
    if (newStage) {
      setStages([...stages, { id: Date.now().toString(), name: newStage }])
      setNewStage('')
    }
  }

  const handleAddSegment = () => {
    if (newSegment) {
      setSegments([...segments, { id: Date.now().toString(), name: newSegment, products: [] }])
      setNewSegment('')
    }
  }

  const handleAddProduct = () => {
    if (selectedSegment && newProduct) {
      const updatedSegments = segments.map(segment => 
        segment.id === selectedSegment.id 
          ? { ...segment, products: [...segment.products, { id: Date.now().toString(), name: newProduct, start: 0, end: 0 }] }
          : segment
      )
      setSegments(updatedSegments)
      setNewProduct('')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="newStage">Nueva etapa</Label>
        <div className="flex">
          <Input id="newStage" value={newStage} onChange={(e) => setNewStage(e.target.value)} className="mr-2" />
          <Button onClick={handleAddStage}>Agregar</Button>
        </div>
      </div>
      <div className="mb-4">
        <Label htmlFor="newSegment">Nuevo segmento</Label>
        <div className="flex">
          <Input id="newSegment" value={newSegment} onChange={(e) => setNewSegment(e.target.value)} className="mr-2" />
          <Button onClick={handleAddSegment}>Agregar</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Segmento</th>
              {stages.map(stage => (
                <th key={stage.id} className="px-4 py-2">{stage.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {segments.map(segment => (
              <tr key={segment.id}>
                <td className="px-4 py-2">{segment.name}</td>
                {stages.map(stage => (
                  <td key={stage.id} className="px-4 py-2">
                    {segment.products.filter(product => 
                      product.start <= stages.indexOf(stage) && product.end >= stages.indexOf(stage)
                    ).map(product => (
                      <div key={product.id} className="bg-green-100 p-1 rounded">{product.name}</div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Label htmlFor="selectedSegment">Seleccionar segmento</Label>
        <select 
          id="selectedSegment" 
          value={selectedSegment?.id || ''} 
          onChange={(e) => setSelectedSegment(segments.find(s => s.id === e.target.value) || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleccione un segmento</option>
          {segments.map(segment => (
            <option key={segment.id} value={segment.id}>{segment.name}</option>
          ))}
        </select>
      </div>
      {selectedSegment && (
        <div className="mt-4">
          <Label htmlFor="newProduct">Nuevo producto</Label>
          <div className="flex">
            <Input id="newProduct" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} className="mr-2" />
            <Button onClick={handleAddProduct}>Agregar producto</Button>
          </div>
        </div>
      )}
    </div>
  )
}