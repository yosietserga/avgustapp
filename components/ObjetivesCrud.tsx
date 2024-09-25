"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import FormModal from "@/components/form/modal"
import ConfirmationModal from "@/components/form/confirm-modal"
import { Plus, Edit, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"
import NextImage from 'next/image'

interface Objective {
  id: number;
  name: string;
  icon?: string | File;

}

interface ObjectivesCRUDProps {
  objectives: Objective[];
  onSubmit: (action: 'add' | 'edit' | 'delete', objective: Partial<Objective>) => void;
}

const ObjectivesCRUD: React.FC<ObjectivesCRUDProps> = ({ objectives, onSubmit }) => {
  const [showModal, setShowConfirmModal] = React.useState(false);
  const [selectedObjective, setSelectedObjective] = React.useState<Objective | null>(null);


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
  
  const handleSubmit = async (action: 'add' | 'edit', data: Partial<Objective>) => {
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
    onSubmit(action, data);
  };

  return (
    <>
    <Card className="w-full">
      <FormModal 
      onUpload={handleUpload} 
      onClose={() => {}} 
      onSubmit={(data) => handleSubmit('add', data)} 
      fields={{description:false, icon:true}} 
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
                <FormModal 
                  onUpload={handleUpload}
                  onClose={() => {}} 
                  onSubmit={(data) => handleSubmit('edit', { ...objective, ...data })} 
                  fields={{description: false, icon: true}} 
                  triggerButton={
                    <Button variant="outline" size="sm"  className="text-[#8bc34a] border-[#8bc34a]">
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                  }
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    setSelectedObjective(objective);
                    setShowConfirmModal(true);
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
    <ConfirmationModal 
        isOpen={showModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={() => {
          if (selectedObjective) {
            onSubmit('delete', selectedObjective);
            setShowConfirmModal(false);
          }
        }} 
      />
    </>
  );
};

export default ObjectivesCRUD;