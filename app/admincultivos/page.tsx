// app/admincultivos/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import CropForm from '@/components/form/crop';
import ObjectivesCRUD from '@/components/ObjetivesCrud';
import StagesCRUD from '@/components/StagesCrud';
import SegmentsCRUD from '@/components/SegmentsCrud';
import ProductsCRUD from '@/components/ProductsCrud';
import CropManagementPlan from '@/components/CropManagementPlan';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sprout, Loader2, MoreVertical, Edit, Trash } from "lucide-react"

interface Product {
  id: number;
  name: string;
  description?: string;
  productType: 'insecticida' | 'fungicida' | 'herbicida' | 'nutricion' | 'feromonas' | 'otros_insumos';
  startPercent?: number;
  endPercent?: number;
  stageId?: number;
  segmentId?: number;
}

interface Segment {
  id: number;
  name: string;
  objectiveId: number;
  products: Product[];
}

interface Objective {
  id: number;
  name: string;
  icon: React.ReactNode;
  segments: Segment[];
  stages: Stage[];
}

interface Stage {
  id: number;
  name: string;
  order: number;
  objectiveId: number;
  endProducts: Product[];
  startProducts: Product[];
}

interface Crop {
  id: number;
  name: string;
  objectives: Objective[];
  segments: Segment[];
  stages: Stage[];
}

export default function CropManagement({ cropId }: { cropId?: number }) {
  /*
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const [activeTab, setActiveTab] = useState(objectives[0].id);
  const [isNewObjectiveModalOpen, setIsNewObjectiveModalOpen] = useState(false);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  */
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [isOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropForm, setShowCropForm] = useState(!cropId);
  const [_cropId, setCropId] = useState(null);
  const [activeObjectiveId, setActiveObjectiveId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  console.log({_cropId})
  useEffect(() => {
    if (cropId) {
      fetchCrop();
    }
  }, [cropId]);

  const fetchCrop = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/crops/${cropId}`);
      setCrop(response.data);
      setCropId(response.data.id);
      if (response.data.objectives.length > 0) {
        setActiveObjectiveId(response.data.objectives[0].id);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch crop data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleObjectivesSubmit = async (action: 'add' | 'edit' | 'delete', objective: Partial<Objective>) => {
    try {
      setLoadingSpinner(true);
      let updatedCrop;
      if (action === 'add') {
        const response = await axios.post(`/api/crops/${crop?.id}/objectives`, objective);
        updatedCrop = { ...crop!, objectives: [...crop!.objectives, response.data] };
        setActiveObjectiveId(response.data.id);
      } else if (action === 'edit') {
        await axios.put(`/api/objectives/${objective.id}`, objective);
        updatedCrop = {
          ...crop!,
          objectives: crop!.objectives.map(obj => obj.id === objective.id ? { ...obj, ...objective } : obj)
        };
      } else if (action === 'delete') {
        await axios.delete(`/api/objectives/${objective.id}`);
        updatedCrop = {
          ...crop!,
          objectives: crop!.objectives.filter(obj => obj.id !== objective.id)
        };
        if (activeObjectiveId === objective.id) {
          setActiveObjectiveId(updatedCrop.objectives[0]?.id || null);
        }
      }
      setCrop(updatedCrop!);
    } catch (err) {
      console.error(`Failed to ${action} objective:`, err);
      setError(`Failed to ${action} objective`);
    } finally {
      setLoadingSpinner(false);
    }
  };

  
  const handleStagesSubmit = async (action: 'add' | 'edit' | 'delete', stage: Partial<Stage>) => {
    try {
      setLoadingSpinner(true);
      let updatedCrop;
      if (action === 'add') {
        const response = await axios.post(`/api/crops/${crop?.id}/stages`, {objectiveId:activeObjectiveId, ...stage});
        updatedCrop = { ...crop!, stages: [...crop!.stages, response.data].sort((a, b) => a.order - b.order) };
      } else if (action === 'edit') {
        console.log({...stage, cropId:_cropId})
        await axios.put(`/api/stages/${stage.id}`, {...stage, cropId:_cropId});
        updatedCrop = {
          ...crop!,
          stages: crop!.stages.map(s => s.id === stage.id ? { ...s, ...stage } : s).sort((a, b) => a.order - b.order)
        };

      } else if (action === 'delete') {
        await axios.delete(`/api/stages/${stage.id}`);
        updatedCrop = {
          ...crop!,
          stages: crop!.stages.filter(s => s.id !== stage.id)
        };
      }
      setModalOpen(false)
      setCrop(updatedCrop!);
    } catch (err) {
      console.error(`Failed to ${action} stage:`, err);
      setError(`Failed to ${action} stage`);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleSegmentsSubmit = async (action: 'add' | 'edit' | 'delete', segment: Partial<Segment>) => {
    try {
      setLoadingSpinner(true);
      let updatedCrop;
      if (action === 'add') {
        const response = await axios.post(`/api/crops/${_cropId}/segments`, {objectiveId:activeObjectiveId, ...segment});
        updatedCrop = { ...crop!, segments: [...crop!.segments, {...response.data, products:[]} ] };
      } else if (action === 'edit') {
        await axios.put(`/api/segments/${segment.id}`, {...segment, cropId:_cropId});
        updatedCrop = {
          ...crop!,
          segments: crop!.segments.map(s => s.id === segment.id ? { ...s, ...segment } : s)
        };
      } else if (action === 'delete') {
        await axios.delete(`/api/segments/${segment.id}`);
        updatedCrop = {
          ...crop!,
          segments: crop!.segments.filter(s => s.id !== segment.id)
        };
      }
      setModalOpen(false)
      setCrop(updatedCrop!);
    } catch (err) {
      console.error(`Failed to ${action} segment:`, err);
      setError(`Failed to ${action} segment`);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleProductsSubmit = async (action: 'add' | 'edit' | 'delete', product: Partial<Product>) => {
    try {
      setLoadingSpinner(true);
      let updatedCrop;
      if (action === 'add') {
        const response = await axios.post(`/api/products`, {...product, cropId:_cropId});
        updatedCrop = {
          ...crop!,
          segments: crop!.segments.map(seg =>
            seg.id === product.segmentId
              ? { ...seg, products: [...seg.products, response.data] }
              : seg
          ),
          stages: crop!.stages.map(stage =>
            stage.id === product.stageId
              ? { 
                ...stage, 
                startProducts: [...stage.startProducts, response.data],
                endProducts: [...stage.endProducts, response.data]
              }
              : stage
          )
        };
      } else if (action === 'edit') {
        await axios.put(`/api/products/${product.id}`, {...product, cropId:_cropId});
        updatedCrop = {
          ...crop!,
          segments: crop!.segments.map(seg => ({
            ...seg,
            products: seg.products.map(prod =>
              prod.id === product.id ? { ...prod, ...product } : prod
            )
          })),
          stages: crop!.stages.map(stage => ({
            ...stage,
            startProducts: stage.startProducts.map(prod =>
              prod.id === product.id ? { ...prod, ...product } : prod
            ),
            endProducts: stage.endProducts.map(prod =>
              prod.id === product.id ? { ...prod, ...product } : prod
            )
          }))
        };
      } else if (action === 'delete') {
        await axios.delete(`/api/products/${product.id}`);
        updatedCrop = {
          ...crop!,
          segments: crop!.segments.map(seg => ({
            ...seg,
            products: seg.products.filter(prod => prod.id !== product.id)
          })),
          stages: crop!.stages.map(stage => ({
            ...stage,
            startProducts: stage.startProducts.filter(prod => prod.id !== product.id),
            endProducts: stage.endProducts.filter(prod => prod.id !== product.id)
          }))
        };
      }
      setModalOpen(false)
      setCrop(updatedCrop!);
    } catch (err) {
      console.error(`Failed to ${action} product:`, err);
      setError(`Failed to ${action} product`);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleCropSubmit = async (cropData: { name: string; description?: string; image?: string }) => {
    try {
      setLoading(true);
      if (_cropId) {
        // Update existing crop
        const response = await axios.put(`/api/crops/${_cropId}`, cropData);
        setCrop({...crop, ...response.data});

      } else {
        // Create new crop
        const response = await axios.post('/api/crops', cropData);
        setCrop({...response.data, objectives:[], stages:[], segments:[], products:[]});
        setCropId(response.data.id);

        console.log({_cropId})
      }
      setShowCropForm(false);
      setError(null);
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save crop:', err);
      setError('Failed to save crop');
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  
  if (!crop || showCropForm) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <CropForm
            cropId={_cropId}
            onSubmit={handleCropSubmit}
            onCancel={() => {
              if (_cropId) {
                setShowCropForm(false);
              } else if (confirm('Are you sure you want to cancel creating a new crop?')) {
                setCrop(null);
                setShowCropForm(false);
              }
            }}
          />
        </div>
      );
    }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Plan de Cultivo {crop.name}</h1>
          <Button variant="outline" size="sm"  className="text-[#8bc34a] border-[#8bc34a]" onClick={() => setShowCropForm(true)}>
            Editar Cultivo
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {crop.objectives.length === 0 ? (
          <div className="text-center">
            <p className="mb-4">No hay objetivos. Agrega el primer objetivo para iniciar.</p>
            <Button variant="outline" size="sm"  className="text-[#8bc34a] border-[#8bc34a]" onClick={() => handleObjectivesSubmit('add', { name: 'Nuevo Objetivo' })}>
              + Agregar Objetivo
              {loadingSpinner && <Loader2 className="animate-spin h-5 w-5 ml-2" />}
            </Button>
          </div>
        ) : (
          <Tabs value={activeObjectiveId?.toString()} onValueChange={(value) => setActiveObjectiveId(Number(value))}>
            <div className="overflow-x-auto">

            <TabsList className="bg-white p-1 rounded-md">
              {crop.objectives.map((objective) => (
                <>
                <TabsTrigger 
                  key={objective.id} 
                  value={objective.id.toString()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md data-[state=active]:bg-[#8bc34a] data-[state=active]:text-white"
                >
                  {objective.icon??<Sprout className="w-4 h-4" />}
                  {objective.name}
                </TabsTrigger>
                <DropdownMenu open={openMenuId === objective.id} onOpenChange={(open) => setOpenMenuId(open ? objective.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 absolute right-1 top-1/2 -translate-y-1/2">
                        <MoreVertical className="h-4 w-4" />
                        ...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleObjectivesSubmit('edit', { id: objective.id, name: objective.name })}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar {loadingSpinner && <Loader2 className="animate-spin h-5 w-5 ml-2" />}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleObjectivesSubmit('delete', { id: objective.id })}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Eliminar {loadingSpinner && <Loader2 className="animate-spin h-5 w-5 ml-2" />}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </>
              ))}
            </TabsList>
            </div>

            <div className="pt-0 text-right">
              <Button onClick={() => handleObjectivesSubmit('add', { name: 'Nuevo Objetivo' })} variant="outline" className="bg-[#8bc34a] text-white hover:bg-[#059669]">
                + Agregar Objetivo
                {loadingSpinner && <Loader2 className="animate-spin h-5 w-5 ml-2" />}
              </Button>
            </div>

            {crop.objectives.map((objective) => (
              <TabsContent key={objective.id} value={objective.id.toString()}  className="bg-white p-6 rounded-lg shadow">
                <div className="space-y-8">
                  <ObjectivesCRUD
                    objectives={[objective]}
                    onSubmit={(action, updatedObjective) => handleObjectivesSubmit(action, { ...updatedObjective, id: objective.id })}
                  />
                  </div>

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <SegmentsCRUD
                    results={crop.segments.filter(segment => segment.objectiveId === objective.id) || []}
                    objectiveId={objective.id}
                    onSubmit={handleSegmentsSubmit}
                    onCancel={() => {}}
                  />
                  </div>

                <div>

                  <StagesCRUD
                    results={crop.stages.filter(stage => stage.objectiveId === objective.id) || []}
                    objectiveId={objective.id}
                    onSubmit={handleStagesSubmit}
                    onCancel={() => {}}
                  />
                  </div>
                  </div>
                <div className="w-full mt-8">

                  <ProductsCRUD
                    results={crop.segments?.filter(s => s.objectiveId === objective.id).flatMap(seg => seg.products) || []}
                    segments={crop.segments.filter(s => s.objectiveId === objective.id) || []}
                    stages={crop.stages.filter(s => s.objectiveId === objective.id) || []}
                    parentId={objective.id}
                    parentType="objective"
                    onSubmit={handleProductsSubmit}
                    onCancel={() => {}}
                  />

                  <CropManagementPlan
                    cropId={_cropId}
                    objectiveId={activeObjectiveId}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>

      <Dialog open={!!error} onOpenChange={() => setError(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p>{error}</p>
          <DialogFooter>
            <Button onClick={() => setError(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}