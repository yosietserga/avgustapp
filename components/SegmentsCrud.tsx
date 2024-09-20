// components/SegmentsCRUD.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from 'lucide-react';

interface Segment {
  id: string;
  name: string;
}

export function SegmentsCRUD() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [newSegmentName, setNewSegmentName] = useState('');

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    const response = await fetch('/api/segments');
    const data = await response.json();
    setSegments(data);
  };

  const handleAddSegment = async () => {
    if (newSegmentName) {
      const response = await fetch('/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSegmentName }),
      });
      if (response.ok) {
        fetchSegments();
        setNewSegmentName('');
      }
    }
  };

  const handleEditSegment = async (id: string, newName: string) => {
    const response = await fetch(`/api/segments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    if (response.ok) {
      fetchSegments();
    }
  };

  const handleDeleteSegment = async (id: string) => {
    const response = await fetch(`/api/segments/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchSegments();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        Segmentos
        <Button variant="outline" size="sm" onClick={handleAddSegment} className="text-[#10B981] border-[#10B981]">
          + Crear segmento
        </Button>
      </h2>
      <div className="space-y-2">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span>{segment.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                  const newName = prompt('Enter new name', segment.name);
                  if (newName) handleEditSegment(segment.id, newName);
                }}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteSegment(segment.id)}>Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Input
          value={newSegmentName}
          onChange={(e) => setNewSegmentName(e.target.value)}
          placeholder="Escriba el nuevo segmento"
          className="w-full"
        />
      </div>
    </div>
  );
}