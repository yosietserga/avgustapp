// components/Objectives.tsx
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Objective {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface ObjectivesProps {
  objectives: Objective[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  setIsNewObjectiveModalOpen: (value: boolean) => void;
}

export function Objectives({ objectives, activeTab, setActiveTab, setIsNewObjectiveModalOpen }: ObjectivesProps) {
  return (
    <div className="flex justify-between items-center">
      <TabsList className="bg-white p-1 rounded-md">
        {objectives.map((objective) => (
          <TabsTrigger
            key={objective.id}
            value={objective.id}
            className="flex items-center space-x-2 px-3 py-2 rounded-md data-[state=active]:bg-[#10B981] data-[state=active]:text-white"
          >
            {objective.icon}
            <span>{objective.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <Button onClick={() => setIsNewObjectiveModalOpen(true)} variant="outline" className="bg-[#10B981] text-white hover:bg-[#059669]">
        + Crear objetivo
      </Button>
    </div>
  );
}