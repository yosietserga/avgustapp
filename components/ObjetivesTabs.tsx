"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import FormModal from "@/components/form/modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ConfirmationModal from "@/components/form/confirm-modal"
import { Sprout, Loader2, Edit, Trash } from 'lucide-react';
import NextImage from 'next/image'

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

interface Stage {
  id: number;
  name: string;
  order: number;
  objectiveId: number;
  endProducts: Product[];
  startProducts: Product[];
}

interface Objective {
  id: number;
  name: string;
  icon: React.ReactNode;
  segments: Segment[];
  stages: Stage[];
}

interface ObjectivesCRUDProps {
  objectives: Objective[];
  onSubmit: (action: 'add' | 'edit' | 'delete', objective: Partial<Objective>) => void;
}

const ObjectivesCRUD: React.FC<ObjectivesCRUDProps> = ({ objectives, onSubmit }) => {
  const [showModal, setShowConfirmModal] = React.useState(false);
  const [selectedObjective, setSelectedObjective] = React.useState<Objective | null>(null);
  const [loadingSpinner, setLoadingSpinner] = React.useState(false);
  const [openMenuId, setOpenMenuId] = React.useState<number | null>(null);

  return (
    <>
    <div className="overflow-x-auto flex justify-between items-center">
            
            <TabsList className="bg-white p-1 rounded-md">
              {objectives.map((objective) => (
                <>
                <TabsTrigger 
                  key={objective.id} 
                  value={objective.id.toString()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md data-[state=active]:bg-[#8bc34a] data-[state=active]:text-white"
                >
                  {objective.icon??<Sprout className="w-4 h-4" />}
                  {objective.name}
                  
                  <DropdownMenu open={openMenuId === objective.id} onOpenChange={(open) => setOpenMenuId(open ? objective.id : null)}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-5 w-5 pt-1">
                          :
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSubmit('edit', { id: objective.id, name: objective.name })}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar {loadingSpinner && <Loader2 className="animate-spin h-5 w-5 ml-2" />}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedObjective(objective);
                          setShowConfirmModal(true);
                        }}>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Eliminar {loadingSpinner && <Loader2 className="animate-spin h-5 w-5 ml-2" />}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TabsTrigger>
                  </>
              ))}
            </TabsList>
            
              <Button onClick={() => onSubmit('add', { name: 'Nuevo Objetivo' })} variant="outline" className="pt-0 text-right bg-[#8bc34a] text-white hover:bg-[#059669]">
                + Agregar Objetivo
                {loadingSpinner && <Loader2 className="animate-spin h-5 w-5 ml-2" />}
              </Button>
              
            </div>
    
    <ConfirmationModal 
        isOpen={showModal} 
        onClose={() => {
          setLoadingSpinner(false)
          setShowConfirmModal(false)
        }} 
        onConfirm={() => {
          if (selectedObjective) {
            onSubmit('delete', selectedObjective);
            setShowConfirmModal(false);
            setLoadingSpinner(true);
          }
        }} 
      />
    </>
  );
};

export default ObjectivesCRUD;