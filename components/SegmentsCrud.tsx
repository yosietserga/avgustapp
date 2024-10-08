import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import FormModal from "@/components/form/modal"
import ConfirmationModal from "@/components/form/confirm-modal"
import { Sprout, Bug, Leaf, Droplets, Sun, MoreVertical, Plus, Edit, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Segment {
  id: number;
  name: string;
  objectiveId: number;
}

interface SegmentsCRUDProps {
  results: Segment[];
  objectiveId: number;
  onSubmit: (action: 'add' | 'edit' | 'delete', segment: Partial<Segment>) => void;
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

const SegmentsCRUD: React.FC<SegmentsCRUDProps> = ({ results, objectiveId, onSubmit, onCancel }) => {
  const [newSegmentName, setNewSegmentName] = useState('');
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);
  const [showModal, setShowCofirmModal] = React.useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleSubmit = async (data: FormData) :Promise<void> => {
    if (editingSegment) {
      await onSubmit('edit', { id: editingSegment.id, name: data.name, objectiveId });
    } else {
      await onSubmit('add', { name: data.name, objectiveId });
    }

    setNewSegmentName('');
    setEditingSegment(null);
    setIsFormModalOpen(false);
  };
  
  const handleDelete = (segment: Segment) => {
    setSegmentToDelete(segment);
    setShowCofirmModal(true);
  };

  const confirmDelete = async () => {
    if (segmentToDelete) {
      await onSubmit('delete', { id: segmentToDelete.id });
      setShowCofirmModal(false);
      setSegmentToDelete(null);
    }
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        Segmentos
        
        <FormModal 
          isOpen={isFormModalOpen}
          title={editingSegment ? "Editar Segmento" : "Crear Segmento"}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingSegment(null);
          }} 
          onSubmit={handleSubmit}
          fields={{description:false, icon:false}} 
          values={editingSegment??null} 
          triggerButton={<></>}
        />
        <Button 
          variant="outline" 
          size="sm"  
          className="text-[#8bc34a] border-[#8bc34a]" 
          onClick={openFormModal}
        >
          + Crear Segmento
        </Button>
      </h2>
      
      {editingSegment && (
      <form className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newSegmentName}
            onChange={(e) => setNewSegmentName(e.target.value)}
            placeholder="Nombre del Segmento"
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="button" 
            onClick={() => {
              handleSubmit({name:newSegmentName})
            }}
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Guardar
          </button>
        </div>
          <button 
            type="button" 
            onClick={() => setEditingSegment(null)}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
      </form>
        )}
      

      <ul className="space-y-4">
        {Array.isArray(results) && results.map((segment) => (
          <li key={segment.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
            <span className="text-gray-800">{segment.name}</span>
            <div className="space-x-2">
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button 
                      onClick={() => {
                        setEditingSegment(segment);
                        setNewSegmentName(segment.name);
                        setIsFormModalOpen(true);
                      }}
                      variant="secondary" size="sm"
                    >
                        <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(segment)}>
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

export default SegmentsCRUD;