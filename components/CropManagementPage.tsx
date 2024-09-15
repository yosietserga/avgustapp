'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CropBanner from './CropBanner'
import ObjectiveForm from './ObjectiveForm'
import TimelineView from './TimelineView'
import { Crop, Objective } from '@/types'

export default function CropManagementPage({ crop }: { crop: Crop }) {
  const [objectives, setObjectives] = useState<Objective[]>(crop.objectives)
  const [activeTab, setActiveTab] = useState(objectives[0]?.id || '')

  const handleAddObjective = (newObjective: Objective) => {
    setObjectives([...objectives, newObjective])
    setActiveTab(newObjective.id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CropBanner crop={crop} />
      <h2 className="text-2xl font-bold mb-4">Manejo de cultivos</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {objectives.map((objective) => (
              <TabsTrigger key={objective.id} value={objective.id}>
                {objective.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <ObjectiveForm onAddObjective={handleAddObjective} />
        </div>
        {objectives.map((objective) => (
          <TabsContent key={objective.id} value={objective.id}>
            <TimelineView objective={objective} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}