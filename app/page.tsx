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
        </section>
      </main>
    </div>
  )
}