// components/Objetives.tsx
import React from 'react';
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash } from 'lucide-react';

interface Objective {
  id: number;
  name: string;
}

interface ObjectivesCRUDProps {
  objectives: Objective[];
  onSubmit: (action: 'add' | 'edit' | 'delete', objective: Partial<Objective>) => void;
}

const ObjectivesCRUD: React.FC<ObjectivesCRUDProps> = ({ objectives, onSubmit }) => {
  return (
    <div className="flex items-center space-x-2">
      {objectives.map((objective) => (
        <div key={objective.id} className="flex items-center">
          <span className="mr-2">{objective.name}</span>
          <Button variant="ghost" size="sm" onClick={() => onSubmit('edit', objective)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSubmit('delete', objective)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => onSubmit('add', { name: 'New Objective' })}>
        <Plus className="mr-2 h-4 w-4" /> Add Objective
      </Button>
    </div>
  );
};

export default ObjectivesCRUD;