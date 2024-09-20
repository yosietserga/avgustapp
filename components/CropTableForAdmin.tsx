// components/CropTable.tsx
import React, { useState, useEffect } from 'react';

interface Stage {
  id: string;
  name: string;
}

interface Segment {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  start: number;
  end: number;
  startPercentage: number;
  endPercentage: number;
}

interface CropTableProps {
  cropId: string;
}

export function CropTable({ cropId }: CropTableProps) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCropData();
  }, [cropId]);

  const fetchCropData = async () => {
    const stagesResponse = await fetch(`/api/crops/${cropId}/stages`);
    const segmentsResponse = await fetch(`/api/crops/${cropId}/segments`);
    const productsResponse = await fetch(`/api/crops/${cropId}/products`);

    const stagesData = await stagesResponse.json();
    const segmentsData = await segmentsResponse.json();
    const productsData = await productsResponse.json();

    setStages(stagesData);
    setSegments(segmentsData);
    setProducts(productsData);
  };

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Segmento
            </th>
            {stages.map((stage) => (
              <th key={stage.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {stage.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {segments.map((segment) => (
            <tr key={segment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {segment.name}
              </td>
              {stages.map((stage, stageIndex) => (
                <td key={stage.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {products
                    .filter(
                      (product) =>
                        product.start <= stageIndex &&
                        product.end >= stageIndex
                    )
                    .map((product) => (
                      <div key={product.id} className="bg-[#D1FAE5] p-2 rounded mb-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs">{product.description}</p>
                      </div>
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}