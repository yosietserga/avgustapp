'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CropManagementPlan from "@/components/CropManagementPlan"
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [activeTab, setActiveTab] = useState('manejo-de-malezas')
  
  const timelineStages = [
    { name: 'Germinación', icon: '🌱' },
    { name: 'Macollamiento', icon: '🌿' },
    { name: 'Inicio espigamiento', icon: '🌾' },
    { name: 'Estado lechoso', icon: '🥛' },
    { name: 'Maduración de granos', icon: '🌾' },
  ]

  const phases = ['Quemas', 'Pre-emergencia', 'Post-emergencia']

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="flex-grow">
        <section className="relative overflow-hidden bg-green-50 py-20">
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-green-200 rounded-full opacity-20"
                style={{
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </motion.div>
          <div className="container mx-auto px-4 flex items-center relative z-10">
            <div className="w-1/2 pr-8">
              <h1 className="text-4xl font-bold mb-4 text-green-800">Arroz</h1>
              <p className="text-lg text-gray-600 mb-6">
                El arroz es uno de los cultivos más importantes a nivel mundial.
                Su producción eficiente requiere un manejo adecuado en todas sus etapas
                de crecimiento, desde la siembra hasta la cosecha.
              </p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300">
                Conocer más
              </button>
            </div>
            <div className="w-1/2">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Woman in rice field"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <CropManagementPlan />
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-green-800">
              Plan De Manejo Del Cultivo De Arroz
            </h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-8 border-b border-gray-200">
                {['Manejo de malezas', 'Manejo de plagas', 'Manejo de enfermedades', 'Bioestimulación', 'Cosecha'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase().replace(/ /g, '-')}
                    className="px-4 py-2 text-gray-600 hover:text-green-600 focus:outline-none"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {['manejo-de-malezas', 'manejo-de-plagas', 'manejo-de-enfermedades', 'bioestimulacion', 'cosecha'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue}>
                  <div className="mb-8">
                    <div className="flex justify-between mb-4">
                      {timelineStages.map((stage, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="text-2xl mb-2">{stage.icon}</div>
                          <div className="text-sm text-gray-600">{stage.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-8">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-gray-100">Fase</th>
                          {timelineStages.map((stage, index) => (
                            <th key={index} className="border p-2 bg-gray-100">{stage.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {phases.map((phase, index) => (
                          <tr key={index}>
                            <td className="border p-2 font-semibold">{phase}</td>
                            {timelineStages.map((_, stageIndex) => (
                              <td key={stageIndex} className="border p-2">
                                {index === 2 && stageIndex === 3 && (
                                  <div className="bg-green-100 p-1 rounded">
                                    ROJO 180 EC<br />
                                    (Cyhalofop-butyl 180 g/L)
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  )
}