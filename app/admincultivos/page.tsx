// app/admincultivos/page.tsx
"use client"
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Objectives } from '@/components/Objetives';
import { StagesCRUD } from '@/components/StagesCrud';
import { SegmentsCRUD } from '@/components/SegmentsCrud';
import { ProductsCRUD } from '@/components/ProductsCrud';
import { CropTable } from '@/components/CropTableForAdmin';
import { Sprout } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Objective {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const initialObjectives: Objective[] = [
  {
    id: "1",
    title: "Objetivo 1",
    icon: <Sprout className="w-4 h-4" />,
  },
];

export default function CropManagement() {
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const [activeTab, setActiveTab] = useState(objectives[0].id);
  const [isNewObjectiveModalOpen, setIsNewObjectiveModalOpen] = useState(false);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');

  const handleAddObjective = () => {
    if (newObjectiveTitle) {
      const newObjective: Objective = {
        id: (objectives.length + 1).toString(),
        title: newObjectiveTitle,
        icon: <Sprout className="w-4 h-4" />,
      };
      setObjectives([...objectives, newObjective]);
      setNewObjectiveTitle('');
      setIsNewObjectiveModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Cultivo de Arroz</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <Objectives 
            objectives={objectives} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            setIsNewObjectiveModalOpen={setIsNewObjectiveModalOpen} 
          />
          {objectives.map((objective) => (
            <TabsContent key={objective.id} value={objective.id} className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-2 gap-6">
                <StagesCRUD />
                <SegmentsCRUD />
              </div>
              <ProductsCRUD />
              <CropTable cropId="1" /> {/* Replace with actual crop ID */}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Dialog open={isNewObjectiveModalOpen} onOpenChange={setIsNewObjectiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo objetivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="objectiveTitle" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <Input
                id="objectiveTitle"
                value={newObjectiveTitle}
                onChange={(e) => setNewObjectiveTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="objectiveImage" className="block text-sm font-medium text-gray-700">
                Agregar imagen
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Subir un archivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                </div>
              </div>
            </div>
            <Button onClick={handleAddObjective} className="w-full bg-[#10B981] text-white hover:bg-[#059669]">
              Crear objetivo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}