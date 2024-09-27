import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import FormModal from "@/components/form/modal"
import ConfirmationModal from "@/components/form/confirm-modal"
import { Edit, Trash, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


interface Stage {
  id: number;
  name: string;
  order: number;
  objectiveId: number;
}

interface StagesCRUDProps {
  results: Stage[];
  objectiveId: number;
  onSubmit: (action: 'add' | 'edit' | 'delete', stage: Partial<Stage>) => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  icon?: string;
  description?: string;
  objectiveId?: number;
  cropId?: number;
  order?: number;
};

const StagesCRUD: React.FC<StagesCRUDProps> = ({ results, objectiveId, onSubmit, onCancel }) => {
  const [newStageName, setNewStageName] = useState('');
  const [newStageOrder, setNewStageOrder] = useState('1');
  const [stageToDelete, setStageToDelete] = useState<Stage | null>(null);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [showModal, setShowCofirmModal] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleSubmit = async (data: FormData):Promise<void> => {
    console.log(data)
    if (editingStage) {
      await onSubmit('edit', { id: editingStage.id, name:data.name, order:data.order, objectiveId });
    } else {
      await onSubmit('add', { name: data.name, order:1 });
    }
    setNewStageName('');
    setNewStageOrder('');
    setEditingStage(null);
    setIsFormModalOpen(false);
  };
  
  
  const handleDelete = (stage:Stage) => {
    setStageToDelete(stage);
    setShowCofirmModal(true);
  };

  const confirmDelete = async () => {
    if (stageToDelete) {
      await onSubmit('delete', { id: stageToDelete.id });
      setShowCofirmModal(false);
      setStageToDelete(null);
    }
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
         Etapas Fenológicas
        <FormModal 
          title={editingStage ? "Editar Etapa" : "Crear Etapa"}
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingStage(null)
          }}
          onSubmit={handleSubmit} 
          fields={{description:false, icon:false}} 
          values={editingStage??null} 
          triggerButton={<></>}
        />
        <Button 
          variant="outline" 
          size="sm"  
          className="text-[#8bc34a] border-[#8bc34a]" 
          onClick={openFormModal}
        >
          + Crear Etapa
        </Button>
        
      </h2>
      <form className="mb-6 space-y-4">
        {editingStage && (
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            placeholder="Stage name"
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="hidden"
            value={newStageOrder??1}
            onChange={(e) => setNewStageOrder(e.target.value)}
            placeholder="Order"
            required
            className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="button" 
            onClick={(e) => {
              handleSubmit({name:newStageName, order:parseInt(newStageOrder)})
            }}
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Guardar
          </button>
          <button 
            type="button" 
            onClick={(e) => {
              setEditingStage(null);
              setIsFormModalOpen(false);
            }}
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
        </div>
        )}
      </form>
      <ul className="space-y-4">
        {Array.isArray(results) && results.map((stage) => (
          <li key={stage.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
            <div>
              <span className="text-gray-800 font-medium">{stage.name}</span>
              {/**<span className="ml-2 text-sm text-gray-500">Order: {stage.order}</span>*/}
            </div>
            <div className="space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger >
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button 
                      onClick={() => {
                        setEditingStage(stage);
                        setNewStageName(stage.name);
                        setNewStageOrder(stage.order.toString());
                        setIsFormModalOpen(true);
                      }}
                      variant="secondary" size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(stage)}>
                      <Trash className="h-4 w-4 mr-2" /> Eliminar
                    </Button>
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
      
      <ConfirmationModal 
        isOpen={showModal} 
        onClose={() => setShowCofirmModal(false)} 
        onConfirm={confirmDelete} 
      />
      {/**
      <button 
        onClick={onCancel}
        className="mt-6 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
      >
        Cancel
      </button>
       */}
    </div>
  );
};

export default StagesCRUD;