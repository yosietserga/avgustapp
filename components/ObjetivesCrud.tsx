"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import FormModal from "@/components/form/modal"
import ConfirmationModal from "@/components/form/confirm-modal"
import { Plus, Edit, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"
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
  cropId: number;
  name: string;
  icon: React.ReactNode;
  segments: Segment[];
  stages: Stage[];
}

interface ObjectivesCRUDProps {
  objectives: Objective[];
  onSubmit: (action: 'add' | 'edit' | 'delete', objective: Partial<Objective>) => void;
}

type FormData = {
  name: string;
  icon?: string;
  description?: string;
  cropId?: number;
};

const ObjectivesCRUD: React.FC<ObjectivesCRUDProps> = ({ objectives, onSubmit }) => {
  const [selectedObjective, setSelectedObjective] = React.useState<Objective | null>(null);

  const [objectiveToDelete, setObjectiveToDelete] = React.useState<Objective | null>(null);
  const [showModal, setShowCofirmModal] = React.useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);

  const handleDelete = (o: Objective) => {
    setObjectiveToDelete(o);
    setShowCofirmModal(true);
  };

  const confirmDelete = async () => {
    if (objectiveToDelete) {
      await onSubmit('delete', { id: objectiveToDelete.id });
      setShowCofirmModal(false);
      setObjectiveToDelete(null);
    }
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  }

  /*
  const handleUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.filePath;
  };
  */
  const handleSubmit = async (action: 'add' | 'edit', data: Partial<Objective>) => {
    /*
    if (data.icon && data.icon instanceof File) {
      try {
        const iconPath = await handleUpload(data.icon);
        data.icon = iconPath;
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error (e.g., show error message to user)
        return;
      }
    }
      */
    onSubmit(action, data);
  };

  const objectiveToFormData = (objective: Objective | null): FormData | null => {
    if (!objective) return null;
    return {
      name: objective.name,
      icon: objective.icon ? String(objective.icon) : undefined,
      cropId: objective.cropId,
      // Add other fields as needed
    };
  };

  return (
    <>
    <Card className="w-full">
      <FormModal 
      isOpen={isFormModalOpen}
      onClose={() => {
        setIsFormModalOpen(false);
        setSelectedObjective(null);
      }} 
      onSubmit={(data) => handleSubmit('add', data)} 
      fields={{description:false, icon:true}} 
        values={objectiveToFormData(selectedObjective)} 
      triggerButton={
          <Button variant="outline" className="bg-[#8bc34a] text-white hover:bg-[#059669]">
            + Agregar Objetivo
          </Button>
        }
      />

      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Objetivos</h2>
        <div className="space-y-4">
          {objectives.map((objective) => (
            <div key={objective.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              
              <div className="flex items-center">
                {objective.icon && (
                  <NextImage 
                    src={objective.icon as string} 
                    alt={objective.name} 
                    width={40} 
                    height={40} 
                    className="mr-3 rounded-full"
                  />
                )}
                <span className="text-lg font-medium">{objective.name}</span>
              </div>
              <div className="space-x-2">
                <Button 
                  onClick={() => {
                    setSelectedObjective(objective);
                    setIsFormModalOpen(true);
                  }}
                  variant="secondary" size="sm"
                >
                    <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(objective)}
                >
                  <Trash className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
    <ConfirmationModal 
      isOpen={showModal} 
      onClose={() => setShowCofirmModal(false)} 
      onConfirm={confirmDelete} 
    />
    </>
  );
};

export default ObjectivesCRUD;