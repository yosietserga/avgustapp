"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StageFormModal from "@/components/form/stage-modal"
import ProductFormModal from "@/components/form/product-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sprout, Bug, Leaf, Droplets, Sun, MoreVertical } from 'lucide-react'

interface Objective {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface Stage {
  id: string;
  name: string;
}

interface Segment {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  start: number;
  end: number;
  startPercentage: number;
  endPercentage: number;
}

const initialObjectives: Objective[] = [
  { id: '1', title: 'Manejo de malezas', icon: <Sprout className="w-4 h-4" /> },
  { id: '2', title: 'Manejo de plagas', icon: <Bug className="w-4 h-4" /> },
  { id: '3', title: 'Manejo de enfermedades', icon: <Leaf className="w-4 h-4" /> },
  { id: '4', title: 'Bioestimulación', icon: <Droplets className="w-4 h-4" /> },
  { id: '5', title: 'Cosechadoras', icon: <Sun className="w-4 h-4" /> },
];

const initialStages: Stage[] = [
  { id: '1', name: 'Siembra' },
  { id: '2', name: 'Emergencia' },
  { id: '3', name: 'Macollamiento' },
  { id: '4', name: 'Primordio floral' },
  { id: '5', name: 'Embuchamiento' },
  { id: '6', name: 'Inicio espigamiento' },
  { id: '7', name: 'Estado lechoso' },
  { id: '8', name: 'Maduración de grano' },
];

const initialSegments: Segment[] = [
  { id: '1', name: 'Quema' },
  { id: '2', name: 'Pre-emergencia' },
  { id: '3', name: 'Post-emergencia' },
];

const initialProducts: Product[] = [
  { id: '1', name: 'BISOUNCE 757 WG', description: 'Contenido: Carbendazim 500 g/kg', start: 0, end: 1, startPercentage: 0, endPercentage: 100 },
  { id: '2', name: 'BRULEC', description: '', start: 0, end: 1, startPercentage: 0, endPercentage: 100 },
  { id: '3', name: 'AFINEX 450 EC', description: '', start: 0, end: 1, startPercentage: 0, endPercentage: 100 },
];

export default function CropManagement() {
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState(objectives[0].id);
  const [isNewObjectiveModalOpen, setIsNewObjectiveModalOpen] = useState(false);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [newSegmentName, setNewSegmentName] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductStart, setNewProductStart] = useState<number>(0);
  const [newProductEnd, setNewProductEnd] = useState<number>(0);
  const [newProductStartPercentage, setNewProductStartPercentage] = useState<number>(0);
  const [newProductEndPercentage, setNewProductEndPercentage] = useState<number>(100);

  const handleAddObjective = () => {
    if (newObjectiveTitle) {
      const newObjective: Objective = {
        id: (objectives.length + 1).toString(),
        title: newObjectiveTitle,
        icon: <Sprout className="w-4 h-4" />,
      };
      setObjectives([...objectives, newObjective]);
      setNewObjectiveTitle('');
      setIsNewObjectiveModalOpen(false);
    }
  };

  const handleAddStage = () => {
    if (newStageName) {
      const newStage: Stage = {
        id: (stages.length + 1).toString(),
        name: newStageName,
      };
      setStages([...stages, newStage]);
      setNewStageName('');
    }
  };

  const handleAddSegment = () => {
    if (newSegmentName) {
      const newSegment: Segment = {
        id: (segments.length + 1).toString(),
        name: newSegmentName,
      };
      setSegments([...segments, newSegment]);
      setNewSegmentName('');
    }
  };

  const handleAddProduct = () => {
    if (newProductName && selectedSegment) {
      const newProduct: Product = {
        id: (products.length + 1).toString(),
        name: newProductName,
        description: newProductDescription,
        start: newProductStart,
        end: newProductEnd,
        startPercentage: newProductStartPercentage,
        endPercentage: newProductEndPercentage,
      };
      setProducts([...products, newProduct]);
      setNewProductName('');
      setNewProductDescription('');
      setNewProductStart(0);
      setNewProductEnd(0);
      setNewProductStartPercentage(0);
      setNewProductEndPercentage(100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Cultivo de Arroz</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white p-1 rounded-md">
              {objectives.map((objective) => (
                <TabsTrigger
                  key={objective.id}
                  value={objective.id}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md data-[state=active]:bg-[#8bc34a] data-[state=active]:text-white"
                >
                  {objective.icon}
                  <span>{objective.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <Button onClick={() => setIsNewObjectiveModalOpen(true)} variant="outline" className="bg-[#8bc34a] text-white hover:bg-[#059669]">
              + Crear objetivo
            </Button>
          </div>
          {objectives.map((objective) => (
            <TabsContent key={objective.id} value={objective.id} className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                    Etapas Fenológicas
                    <Button variant="outline" size="sm" onClick={handleAddStage} className="text-[#8bc34a] border-[#8bc34a]">
                      + Crear etapa
                    </Button>
                  </h2>
                  <div className="space-y-2">
                    {stages.map((stage) => (
                      <div key={stage.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>{stage.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Input
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      placeholder="Escriba la nueva etapa"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                    Segmentos
                    <Button variant="outline" size="sm" onClick={handleAddSegment} className="text-[#8bc34a] border-[#8bc34a]">
                      + Crear segmento
                    </Button>
                  </h2>
                  <div className="space-y-2">
                    {segments.map((segment) => (
                      <div key={segment.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>{segment.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Input
                      value={newSegmentName}
                      onChange={(e) => setNewSegmentName(e.target.value)}
                      placeholder="Escriba el nuevo segmento"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Productos</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.id}>
                            {segment.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={newProductStart.toString()} onValueChange={(value) => setNewProductStart(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Inicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage, index) => (
                          <SelectItem key={stage.id} value={index.toString()}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={newProductStartPercentage}
                      onChange={(e) => setNewProductStartPercentage(Number(e.target.value))}
                      placeholder="%"
                      className="w-20"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Select value={newProductEnd.toString()} onValueChange={(value) => setNewProductEnd(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Fin" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage, index) => (
                          <SelectItem key={stage.id} value={index.toString()}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={newProductEndPercentage}
                      onChange={(e) => setNewProductEndPercentage(Number(e.target.value))}
                      placeholder="%"
                      className="w-20"
                    />
                  </div>
                  <Input
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Nombre del producto"
                  />
                  <Input
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    placeholder="Descripción del producto"
                  />
                  <Button onClick={handleAddProduct} className="col-span-2 bg-[#8bc34a] text-white hover:bg-[#059669]">
                    Agregar producto
                  </Button>
                </div>
              </div>
              <div className="mt-8 overflow-x-auto">


                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Segmento
                      </th>
                      {stages.map((stage) => (
                        <th key={stage.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {stage.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {segments.map((segment) => (
                      <tr key={segment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {segment.name}
                        </td>
                        {stages.map((stage, stageIndex) => (
                          <td key={stage.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {products
                              .filter(
                                (product) =>
                                  product.start <= stageIndex &&
                                  product.end >= stageIndex
                              )
                              .map((product) => (
                                <div key={product.id} className="bg-[#D1FAE5] p-2 rounded mb-1">
                                  <p className="font-semibold">{product.name}</p>
                                  <p className="text-xs">{product.description}</p>
                                </div>
                              ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </TabsContent>
          ))}
        </Tabs>
      <ProductFormModal />
      </main>
      <StageFormModal isOpen={false} onClose={() => {}} onSubmit={() => {}} />
      <ProductFormModal />
      <Dialog open={isNewObjectiveModalOpen} onOpenChange={setIsNewObjectiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo objetivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="objectiveTitle" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <Input
                id="objectiveTitle"
                value={newObjectiveTitle}
                onChange={(e) => setNewObjectiveTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="objectiveImage" className="block text-sm font-medium text-gray-700">
                Agregar imagen
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Subir un archivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                </div>
              </div>
            </div>
            <Button onClick={handleAddObjective} className="w-full bg-[#8bc34a] text-white hover:bg-[#059669]">
              Crear objetivo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}