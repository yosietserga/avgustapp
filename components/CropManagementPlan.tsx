"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

function prepareData(objectives_from_db) {
  const managementData = {};

  objectives_from_db.forEach(objective => {
    //add stages and segments related
    managementData[objective.id] = {
      ...objective,
      stages: objective.stages.filter(s => s.objectiveId === objective.id),//todo: esto es redundante
      segments: objective.segments.filter(s => s.objectiveId === objective.id),//todo: esto es redundante
      products: objective.products.filter(s => s.objectiveId === objective.id),//todo: esto es redundante 
    };
    
    // add products segments related
    objective.segments.forEach((segment, index: number) => {
      managementData[objective.id].segments[index].products = objective.products
        .filter(p => p.segmentId === segment.id && p.objectiveId === objective.id)
        .map(product => {
          const startStage = objective.stages.find(stage => stage.id === product.startStageId);
          const endStage = objective.stages.find(stage => stage.id === product.endStageId);

          return {
            name: product.name,
            start: {
              stageId: product.startStageId,
              stage: startStage ? startStage.name.toLowerCase().replace(/\s+/g, '-') : '',
              percent: product.startPercent
            },
            end: {
              stageId: product.endStageId,
              stage: endStage ? endStage.name.toLowerCase().replace(/\s+/g, '-') : '',
              percent: product.endPercent
            },
            description: product.description
          };
        });
    });
  });

  return managementData;
}
interface Product {
  id: number;
  name: string;
  description?: string;
  productType: 'insecticida' | 'fungicida' | 'herbicida' | 'nutricion' | 'feromonas' | 'otros_insumos';
  startPercent?: number;
  endPercent?: number;
  startStageId?: number;
  endStageId?: number;
}

interface Stage {
  id: number;
  name: string;
  icon: string;
}

interface Segment {
  id: number;
  name: string;
  products: Product[];
  stages: Stage[];
}

interface Objective {
  id: number;
  name: string;
  icon: string;
  segments: Segment[];
  stages: Stage[];
}

interface ObjectivesData {
  [key: number]: Objective;
}

interface IProps {
  cropId?: number;
}

const CropManagementPlan: React.FC<IProps> = ({ cropId }) => {
  const [objectives, setObjectives] = useState<ObjectivesData>({});
  const [segments, setSegments] = useState<Segment[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false)
  const [stageWidths, setStageWidths] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const [_cropId, setCropId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log({selectedObjective, objectives, segments, stages});
  useEffect(() => {
    //if (!cropId) return;
    setCropId(cropId);
    const fetchObjectives = async () => {
      //if (cropId) {
        try {
          const response = await fetch(`/api/crops/${cropId}/objectives`);
          /*
          if (!response.ok) {
            throw new Error('Failed to fetch objectives');
          }
          */
          const d = await response.json();
          const _objectives = prepareData(d) 
          setObjectives(_objectives);
          if (d.length > 0) {
            const firstObjectiveId = d[0].id;
            setSelectedObjective(firstObjectiveId);
            setSegments(_objectives[firstObjectiveId].segments);
            setStages(_objectives[firstObjectiveId].stages);
          }
          console.log([selectedObjective, objectives, segments, stages]);
        } catch (err) {
          setError('Error fetching objectives');
          console.error(err);
        } finally {
          setLoading(false);
        }
      //}
    };

    fetchObjectives();
  }, [_cropId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      updateStageWidths()
    }

    if (selectedObjective) {
        handleResize()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedObjective]);

  const updateStageWidths = () => {
    if (tableRef.current) {
      const headerCells = tableRef.current.querySelectorAll('th:not(:first-child)')
      const newWidths = Array.from(headerCells).map(cell => cell.getBoundingClientRect().width)
      setStageWidths(newWidths)
    }
  }

  const calculateProductWidth = (product) => {
    const startIndex = stages.findIndex(s => s.id === product.start.stageId)
    const endIndex = stages.findIndex(s => s.id === product.end.stageId)
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
    const startIndex = stages.findIndex(s => s.id === product.start.stageId)
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

  const handleObjectiveChange = (value: string) => {
    setSelectedObjective(Number(value));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Plan De Manejo Del Cultivo De Arroz</h2>
      <p className="mb-4">Selecciona Tu Objetivo</p>

      {isMobile ? (
        <Select 
          value={selectedObjective?.toString()} 
          onValueChange={handleObjectiveChange}
        >
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Selecciona un objetivo" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(objectives).map((i) => (
              <SelectItem key={"objective_"+objectives[i].id} value={objectives[i].id}>
                <span className="mr-2">{objectives[i].icon}</span>
                {objectives[i].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Tabs 
          value={selectedObjective?.toString()} 
          onValueChange={handleObjectiveChange}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-5 gap-2">
            {Object.keys(objectives).map((i) => (
              <TabsTrigger key={"objective_"+objectives[i].id} value={objectives[i].id} className="text-left">
                <span className="mr-2">{objectives[i].icon}</span>
                {objectives[i].name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {selectedObjective && objectives[selectedObjective] && (
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div ref={containerRef} className="overflow-x-auto">
          <table ref={tableRef} className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-32 p-2 text-left font-medium sticky left-0 z-20 bg-gray-200"></th>
                {objectives[selectedObjective].stages.map((stage) => (
                  <th key={"stage_"+stage.id} className="p-2 text-center border-l border-gray-300">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center text-white">
                      {stage.icon}
                    </div>
                    <div className="text-sm font-medium">{stage.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {objectives[selectedObjective].segments.map(segment => (
                <>
                <tr key={"segment_"+segment.id} className="border-t border-gray-300">
                  <td className="w-32 p-2 font-medium sticky left-0 bg-white border-r border-gray-300 z-10">
                    {segment.name}
                  </td>
                  <td colSpan={objectives[selectedObjective].stages.length} className="p-2 border-l border-gray-300 relative" style={{ height: '200px' }}>
                    {/* Vertical dashed lines for stage borders */}
                    {stageWidths.map((width, index) => (
                      <div
                        key={"product_marginTop_"+index}
                        className="absolute top-0 bottom-0 border-l border-dashed border-gray-300"
                        style={{
                          left: `${stageWidths.slice(0, index + 1).reduce((a, b) => a + b, 0)}px`,
                          height: '100%'
                        }}
                      ></div>
                    ))}
                    {stageWidths.length > 0 && segment.products.map((product, productIndex) => (
                      <div
                        key={"product_"+product.name}
                        className={cn(
                          "absolute p-1 text-xs rounded",
                          productIndex % 2 === 0 ? "bg-green-100" : "bg-blue-100"
                        )}
                        style={{
                          left: `${calculateProductLeft(product)}px`,
                          width: `${calculateProductWidth(product)}px`,
                          top: `${calculateProductPosition(segment.products, product, productIndex)}px`,
                          zIndex: 1
                        }}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div>{product.description}</div>
                      </div>
                    ))}
                  </td>
                </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  )
}


export default CropManagementPlan;