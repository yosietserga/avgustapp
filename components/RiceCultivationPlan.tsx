'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sprout, Bug, Droplets, Sun, Microscope as Virus } from 'lucide-react'

const timelineStages = [
  "Siembra", "Emergencia", "Macollamiento", "Primordio floral", "Embuchamiento", 
  "Inicio espigamiento", "Estado lechoso", "Maduración de grano"
]

const timelineData = {
  "manejo-de-malezas": [
    { stage: "Quemas", products: ["BISOUNCE 757 WG", "BRULEC", "AFINEX 450 EC"] },
    { stage: "Pre-emergencia", products: ["OXIFEN 240 EC", "CLOFEN 480 EC", "BIOMASTER 240 EC"] },
    { stage: "Post-emergencia", products: ["BISPIC 400 SC", "CLOFEN 480 EC", "BISAFEN 400 SC", "BICIO 100 EC"] },
  ],
  // Add data for other tabs
}

export default function RiceCultivationPlan() {
  const [activeTab, setActiveTab] = useState("manejo-de-malezas")

  const tabs = [
    { id: "manejo-de-malezas", icon: <Sprout className="w-4 h-4 mr-2" />, label: "Manejo de malezas" },
    { id: "manejo-de-plagas", icon: <Bug className="w-4 h-4 mr-2" />, label: "Manejo de plagas" },
    { id: "manejo-de-enfermedades", icon: <Virus className="w-4 h-4 mr-2" />, label: "Manejo de enfermedades" },
    { id: "bioestimulacion", icon: <Droplets className="w-4 h-4 mr-2" />, label: "Bioestimulación" },
    { id: "cosechadoras", icon: <Sun className="w-4 h-4 mr-2" />, label: "Cosechadoras" },
  ]

  return (
    <div>
      <Button variant="ghost" className="mb-4"><ArrowLeft className="mr-2" />Volver</Button>
      <h2 className="text-2xl font-bold mb-4">Plan De Manejo Del Cultivo De Arroz</h2>
      <p className="mb-4">Selecciona Tu Objetivo</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center justify-center">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <div className="mt-4 bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <div className="flex justify-between mb-4 min-w-max">
                {timelineStages.map((stage, index) => (
                  <div key={index} className="flex flex-col items-center mx-4">
                    <Sprout className="w-6 h-6 text-green-500" />
                    <span className="text-xs mt-1 whitespace-nowrap">{stage}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-rows-3 gap-2 min-w-max">
                {timelineData[activeTab].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center">
                    <div className="w-32 font-semibold">{row.stage}</div>
                    <div className="flex-1 grid grid-cols-8 gap-2">
                      {row.products.map((product, productIndex) => (
                        <div key={productIndex} className="bg-white p-2 rounded shadow text-xs">
                          {product}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}