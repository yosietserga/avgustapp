// components/ObjectivesCRUD.tsx
import React from 'react';
import { Button } from "@/components/ui/button"
import FormModal from "@/components/form/modal"
import ConfirmationModal from "@/components/form/confirm-modal"
import { Plus, Edit, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"

interface Objective {
  id: number;
  name: string;
}

interface ObjectivesCRUDProps {
  objectives: Objective[];
  onSubmit: (action: 'add' | 'edit' | 'delete', objective: Partial<Objective>) => void;
}

const ObjectivesCRUD: React.FC<ObjectivesCRUDProps> = ({ objectives, onSubmit }) => {
  const [showModal, setShowCofirmModal] = React.useState(false)
  return (
    <>
    <Card className="w-full">
      <FormModal 
      onClose={() => {}} 
      onSubmit={() => onSubmit('add', { name: 'New Objective' })} 
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
              <span className="text-lg font-medium">{objective.name}</span>
              <div className="space-x-2">
                <FormModal 
                onClose={() => {}} 
                onSubmit={() => onSubmit('edit', objective)} 
                fields={{description:false, icon:true}} 
                triggerButton={
                  <Button variant="outline" size="sm"  className="text-[#8bc34a] border-[#8bc34a]">
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </Button>
                }
              />
              <ConfirmationModal 
                isOpen={showModal} 
                onClose={() => setShowCofirmModal(false)} 
                onConfirm={() => onSubmit('delete', objective)} 
              />
              <Button variant="destructive" size="sm" onClick={() => setShowCofirmModal(true)}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
              </div>
            </div>
          ))}
        </div>
        <Button  className="bg-[#8bc34a] text-white hover:bg-[#059669] mt-4 w-full" onClick={() => onSubmit('add', { name: 'Nuevo Objetivo' })}>
          + Agregar Objetivo
        </Button>
      </CardContent>
    </Card>
    
    </>
  );
};

export default ObjectivesCRUD;