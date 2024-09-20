// components/StagesCRUD.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
}

export function StagesCRUD() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [newStageName, setNewStageName] = useState('');

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    const response = await fetch('/api/stages');
    const data = await response.json();
    setStages(data);
  };

  const handleAddStage = async () => {
    if (newStageName) {
      const response = await fetch('/api/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStageName }),
      });
      if (response.ok) {
        fetchStages();
        setNewStageName('');
      }
    }
  };

  const handleEditStage = async (id: string, newName: string) => {
    const response = await fetch(`/api/stages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    if (response.ok) {
      fetchStages();
    }
  };

  const handleDeleteStage = async (id: string) => {
    const response = await fetch(`/api/stages/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchStages();
    }
  };

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
                <DropdownMenuItem onClick={() => {
                  const newName = prompt('Enter new name', stage.name);
                  if (newName) handleEditStage(stage.id, newName);
                }}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteStage(stage.id)}>Eliminar</DropdownMenuItem>
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