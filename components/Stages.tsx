
// components/Stages.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from 'lucide-react';

interface Stage {
  id: string | number; // Adjust the type as needed
  name: string;
  // Add other properties that a Stage should have
}

interface StagesProps {
  stages: Stage[];
  newStageName: string;
  setNewStageName: (value: string) => void;
  handleAddStage: () => void;
}

export function Stages({ stages, newStageName, setNewStageName, handleAddStage }: StagesProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        Etapas Fenológicas
        <Button variant="outline" size="sm" onClick={handleAddStage} className="text-[#10B981] border-[#10B981]">
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
  );
}