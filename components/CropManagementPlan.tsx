'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const objectives = [
  { id: 'weed-management', label: 'Manejo de malezas', icon: '🌿' },
  { id: 'pest-management', label: 'Manejo de plagas', icon: '🐛' },
  { id: 'disease-management', label: 'Manejo de enfermedades', icon: '🦠' },
  { id: 'biostimulation', label: 'Bioestimulación', icon: '🌱' },
  { id: 'adjuvants', label: 'Coadyuvantes', icon: '💧' },
]

const stages = [
  { id: 'sowing', label: 'Siembra', icon: '🌱' },
  { id: 'emergence', label: 'Emergencia', icon: '🌿' },
  { id: 'tillering', label: 'Macollamiento', icon: '🌾' },
  { id: 'floral-primordium', label: 'Primordio floral', icon: '🌺' },
]

const segments = ['QUEMAS', 'PRE-EMERGENCIA', 'POST-EMERGENCIA']

const managementData = {
  'weed-management': [
    {
      segment: 'QUEMAS',
      products: [
        { name: 'BROUNTER 757 WG', start: { stage: 'sowing', percent: 40 }, end: { stage: 'sowing', percent: 100 }, description: 'Glifosato 757 g/kg' },
        { name: 'IRKUT EC', start: { stage: 'sowing', percent: 0 }, end: { stage: 'sowing', percent: 100 }, description: 'Pendimentalina 400 g/l' },
        { name: 'AFINNEX 400 EC', start: { stage: 'sowing', percent: 50 }, end: { stage: 'sowing', percent: 100 }, description: 'Clomazone 400 g/l' },
        { name: 'OXIFEN 240 EC', start: { stage: 'sowing', percent: 80 }, end: { stage: 'emergence', percent: 87 }, description: 'Oxifluorfen 240 g/l' },
      ],
    },
    {
      segment: 'PRE-EMERGENCIA',
      products: [
        { name: 'OXIFEN 240 EC', start: { stage: 'emergence', percent: 0 }, end: { stage: 'emergence', percent: 100 }, description: 'Oxifluorfen 240 g/l' },
        { name: 'CHEKAN 500 WG', start: { stage: 'emergence', percent: 20 }, end: { stage: 'emergence', percent: 80 }, description: 'Bispyribac-sodium 400 g/kg' },
        { name: 'RICEMASTER 240 SC', start: { stage: 'emergence', percent: 50 }, end: { stage: 'emergence', percent: 100 }, description: 'Penoxulam 240 g/l' },
        { name: 'MOISES 250 EC Y MOISES 380 SC / PENDIMETALINA 400 EC AVGUST / CLOMAZONE 480 EC AVGUST', start: { stage: 'emergence', percent: 70 }, end: { stage: 'tillering', percent: 30 }, description: 'Mezcla de herbicidas' },
      ],
    },
    {
      segment: 'POST-EMERGENCIA',
      products: [
        { name: 'BAIKAL SC', start: { stage: 'tillering', percent: 0 }, end: { stage: 'tillering', percent: 100 }, description: 'Bispyribac-sodium 400 g/l' },
        { name: 'OKUN 250 SC', start: { stage: 'tillering', percent: 20 }, end: { stage: 'tillering', percent: 80 }, description: 'Penoxsulam 250 g/l' },
        { name: 'BERKUT SL', start: { stage: 'tillering', percent: 50 }, end: { stage: 'tillering', percent: 100 }, description: 'Quinclorac 250 g/l' },
        { name: 'BOLO 180 EC', start: { stage: 'floral-primordium', percent: 0 }, end: { stage: 'floral-primordium', percent: 100 }, description: 'Cyhalofop-butyl 180 g/l' },
      ],
    },
  ],
  'pest-management': [
    {
      segment: 'QUEMAS',
      products: [
        { name: 'Pest Product 1', start: { stage: 'sowing', percent: 0 }, end: { stage: 'sowing', percent: 100 }, description: 'Pest control for sowing' },
      ],
    },
    {
      segment: 'PRE-EMERGENCIA',
      products: [
        { name: 'Pest Product 2', start: { stage: 'emergence', percent: 0 }, end: { stage: 'emergence', percent: 100 }, description: 'Pest control for emergence' },
      ],
    },
    {
      segment: 'POST-EMERGENCIA',
      products: [
        { name: 'Pest Product 3', start: { stage: 'tillering', percent: 0 }, end: { stage: 'floral-primordium', percent: 50 }, description: 'Pest control for later stages' },
      ],
    },
  ],
  'disease-management': [
    {
      segment: 'QUEMAS',
      products: [
        { name: 'Disease Product 1', start: { stage: 'sowing', percent: 0 }, end: { stage: 'sowing', percent: 100 }, description: 'Disease control for sowing' },
      ],
    },
    {
      segment: 'PRE-EMERGENCIA',
      products: [
        { name: 'Disease Product 2', start: { stage: 'emergence', percent: 0 }, end: { stage: 'emergence', percent: 100 }, description: 'Disease control for emergence' },
      ],
    },
    {
      segment: 'POST-EMERGENCIA',
      products: [
        { name: 'Disease Product 3', start: { stage: 'tillering', percent: 0 }, end: { stage: 'floral-primordium', percent: 50 }, description: 'Disease control for later stages' },
      ],
    },
  ],
  'biostimulation': [
    {
      segment: 'QUEMAS',
      products: [
        { name: 'Biostimulant 1', start: { stage: 'sowing', percent: 0 }, end: { stage: 'sowing', percent: 100 }, description: 'Biostimulant for sowing' },
      ],
    },
    {
      segment: 'PRE-EMERGENCIA',
      products: [
        { name: 'Biostimulant 2', start: { stage: 'emergence', percent: 0 }, end: { stage: 'emergence', percent: 100 }, description: 'Biostimulant for emergence' },
      ],
    },
    {
      segment: 'POST-EMERGENCIA',
      products: [
        { name: 'Biostimulant 3', start: { stage: 'tillering', percent: 0 }, end: { stage: 'floral-primordium', percent: 50 }, description: 'Biostimulant for later stages' },
      ],
    },
  ],
  'adjuvants': [
    {
      segment: 'QUEMAS',
      products: [
        { name: 'Adjuvant 1', start: { stage: 'sowing', percent: 0 }, end: { stage: 'sowing', percent: 100 }, description: 'Adjuvant for sowing' },
      ],
    },
    {
      segment: 'PRE-EMERGENCIA',
      products: [
        { name: 'Adjuvant 2', start: { stage: 'emergence', percent: 0 }, end: { stage: 'emergence', percent: 100 }, description: 'Adjuvant for emergence' },
      ],
    },
    {
      segment: 'POST-EMERGENCIA',
      products: [
        { name: 'Adjuvant 3', start: { stage: 'tillering', percent: 0 }, end: { stage: 'floral-primordium', percent: 50 }, description: 'Adjuvant for later stages' },
      ],
    },
  ],
}

export default function CropManagementPlan() {
  const [selectedObjective, setSelectedObjective] = useState(objectives[0].id)
  const [isMobile, setIsMobile] = useState(false)
  const [stageWidths, setStageWidths] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      updateStageWidths()
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const updateStageWidths = () => {
    if (tableRef.current) {
      const headerCells = tableRef.current.querySelectorAll('th:not(:first-child)')
      const newWidths = Array.from(headerCells).map(cell => cell.getBoundingClientRect().width)
      setStageWidths(newWidths)
    }
  }

  const calculateProductWidth = (product) => {
    const startIndex = stages.findIndex(s => s.id === product.start.stage)
    const endIndex = stages.findIndex(s => s.id === product.end.stage)
    const startOffset = product.start.percent / 100
    const endOffset = product.end.percent / 100

    let width = 0
    for (let i = startIndex; i <= endIndex; i++) {
      if (i === startIndex) {
        width += stageWidths[i] * (1 - startOffset)
      } else if (i === endIndex) {
        width += stageWidths[i] * endOffset
      } else {
        width += stageWidths[i]
      }
    }

    return width
  }

  const calculateProductLeft = (product) => {
    const startIndex = stages.findIndex(s => s.id === product.start.stage)
    const startOffset = product.start.percent / 100
    let left = 0
    for (let i = 0; i < startIndex; i++) {
      left += stageWidths[i]
    }
    left += stageWidths[startIndex] * startOffset
    return left
  }

  const calculateProductPosition = (products, currentProduct, currentIndex) => {
    const baseHeight = 30 // Height of each product rectangle
    const gap = 5 // Gap between product rectangles

    const currentLeft = calculateProductLeft(currentProduct)
    const currentWidth = calculateProductWidth(currentProduct)
    const currentRight = currentLeft + currentWidth

    let maxTop = 0
    for (let i = 0; i < currentIndex; i++) {
      const product = products[i]
      const left = calculateProductLeft(product)
      const width = calculateProductWidth(product)
      const right = left + width

      // Check if there's any overlap
      if (!(currentRight <= left || currentLeft >= right)) {
        maxTop = Math.max(maxTop, (baseHeight + gap) * (i + 1))
      }
    }

    return maxTop
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Plan De Manejo Del Cultivo De Arroz</h2>
      <p className="mb-4">Selecciona Tu Objetivo</p>

      {isMobile ? (
        <Select value={selectedObjective} onValueChange={setSelectedObjective}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Selecciona un objetivo" />
          </SelectTrigger>
          <SelectContent>
            {objectives.map((objective) => (
              <SelectItem key={objective.id} value={objective.id}>
                <span className="mr-2">{objective.icon}</span>
                {objective.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Tabs value={selectedObjective} onValueChange={setSelectedObjective} className="mb-4">
          <TabsList className="grid w-full grid-cols-5 gap-2">
            {objectives.map((objective) => (
              <TabsTrigger key={objective.id} value={objective.id} className="text-left">
                <span className="mr-2">{objective.icon}</span>
                {objective.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div ref={containerRef} className="overflow-x-auto">
          <table ref={tableRef} className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-32 p-2 text-left font-medium sticky left-0 z-20 bg-gray-200"></th>
                {stages.map((stage) => (
                  <th key={stage.id} className="p-2 text-center border-l border-gray-300">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center text-white">
                      {stage.icon}
                    </div>
                    <div className="text-sm font-medium">{stage.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {segments.map((segment, segmentIndex) => (
                <tr key={segment} className="border-t border-gray-300">
                  <td className="w-32 p-2 font-medium sticky left-0 bg-white border-r border-gray-300 z-10">
                    {segment}
                  </td>
                  <td colSpan={stages.length} className="p-2 border-l border-gray-300 relative" style={{ height: '200px' }}>
                    {/* Vertical dashed lines for stage borders */}
                    {stageWidths.map((width, index) => (
                      <div
                        key={index}
                        className="absolute top-0 bottom-0 border-l border-dashed border-gray-300"
                        style={{
                          left: `${stageWidths.slice(0, index + 1).reduce((a, b) => a + b, 0)}px`,
                          height: '100%'
                        }}
                      ></div>
                    ))}
                    {stageWidths.length > 0 && managementData[selectedObjective][segmentIndex]?.products.map((product, productIndex) => (
                      <div
                        key={product.name}
                        className={cn(
                          "absolute p-1 text-xs rounded",
                          productIndex % 2 === 0 ? "bg-green-100" : "bg-blue-100"
                        )}
                        style={{
                          left: `${calculateProductLeft(product)}px`,
                          width: `${calculateProductWidth(product)}px`,
                          top: `${calculateProductPosition(managementData[selectedObjective][segmentIndex].products, product, productIndex)}px`,
                          zIndex: 1
                        }}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div>{product.description}</div>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}