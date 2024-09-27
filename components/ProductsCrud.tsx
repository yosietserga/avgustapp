import React, { useState } from 'react';
import ProductForm from '@/components/form/product-modal'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: number;
  name: string;
  description?: string;
  productType: 'insecticida' | 'fungicida' | 'herbicida' | 'nutricion' | 'feromonas' | 'otros_insumos';
  startPercent?: number;
  endPercent?: number;
  startStageId?: number;
  endStageId?: number;
  segmentId?: number;
}

interface Stage {
  id: number;
  name: string;
  order: number;
  objectiveId: number;
  endProducts: Product[];
  startProducts: Product[];
}

interface Segment {
  id: number;
  name: string;
  objectiveId: number;
  products: Product[];
}

interface ProductsCRUDProps {
  results: Product[];
  parentId: number;
  parentType: 'segment' | 'stage' | 'objective';
  segments: Segment[];
  stages: Stage[];
  onSubmit: (action: 'add' | 'edit' | 'delete', product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductsCRUD: React.FC<ProductsCRUDProps> = ({ results, segments, stages, parentId, parentType, onSubmit, onCancel }) => {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onSubmit('edit', { ...newProduct, id: editingProduct.id });
    } else {
      onSubmit('add', { ...newProduct, [parentType + 'Id']: parentId });
    }
    setNewProduct({});
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['startPercent', 'endPercent', 'segmentId', 'startStageId', 'endStageId', 'objectiveId'];
    
    setNewProduct(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };
    
  const handleSelectChange = (name: string, value: string) => {
    const numericFields = ['startPercent', 'endPercent', 'segmentId', 'startStageId', 'endStageId', 'objectiveId'];
    
    setNewProduct(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Productos</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="name"
          value={newProduct.name || ''}
          onChange={handleInputChange}
          placeholder="Nombre del producto"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={newProduct.description || ''}
          onChange={handleInputChange}
          placeholder="Descripcion del Producto"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          name="productType"
          value={editingProduct?.productType || newProduct.productType || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona Tipo de Producto</option>
          <option value="insecticida">Insecticida</option>
          <option value="fungicida">Fungicida</option>
          <option value="herbicida">Herbicida</option>
          <option value="nutricion">Nutrición</option>
          <option value="feromonas">Feromonas</option>
          <option value="otros_insumos">Otros Insumos</option>
        </select>

          <select
          name="segmentId"
          value={editingProduct?.segmentId || newProduct.segmentId || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona Segmento</option>
            {segments.map(segment => (
              <option key={segment.id} value={segment.id}>{segment.name}</option>
            ))}
          </select>
        <div className="space-y-4">
          

          
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label>Etapa Ininical</Label>
                <Select                  
                  name="startStageId"
                  value={editingProduct?.startStageId?.toString() || newProduct.startStageId?.toString() || ''}
                  onValueChange={(value) => handleSelectChange('startStageId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona Etapa Inicial" />
                  </SelectTrigger>
                  <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id?.toString()}>{stage.name}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-20">
                <Input 
                  type="number"
                  name="startPercent"
                  value={newProduct.startPercent || ''}
                  onChange={handleInputChange}
                  placeholder="10%"
                />
              </div>

              
              <div className="flex-1">
                <Label>Etapa Final</Label>
                <Select                  
                  name="endtStageId"
                  value={editingProduct?.endStageId?.toString() || newProduct.endStageId?.toString() || ''}
                  onValueChange={(value) => handleSelectChange('endStageId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona Etapa Final" />
                  </SelectTrigger>
                  <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id?.toString()}>{stage.name}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Input 
                  type="number"
                  name="endPercent"
                  value={newProduct.endPercent || ''}
                  onChange={handleInputChange}
                  placeholder="90%"
                />
              </div>
            </div>

          
        </div>
        
          <div className="pt-4 text-center w-full">
            <Button type="submit" className="w-full bg-[#8bc34a] text-white hover:bg-[#7cb342]">
              + Agregar Producto
            </Button>
          </div>
        {editingProduct && (
          <button 
            type="button" 
            onClick={() => setEditingProduct(null)}
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
        )}
      </form>
      <ul className="space-y-4">
        {Array.isArray(results) && results.map((product) => (
          <li key={product.id} className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-800 font-medium">{product.name}</span>
              <div className="space-x-2">
                <button 
                  onClick={() => {
                    setEditingProduct(product);
                    setNewProduct(product);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onSubmit('delete', { id: product.id })}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {product.description && (
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            )}
            <span>Segment: {segments.filter(s => s.id === product.segmentId)[0]?.name??""}</span>
            <div className="text-sm text-gray-500">
              {product.startPercent !== undefined && (
                <span>Inicio: {stages.filter(s => s.id === product.startStageId)[0]?.name??""} {product.startPercent}% </span>
              )}<br />
              {product.endPercent !== undefined && (
                <span>Fin: {stages.filter(s => s.id === product.endStageId)[0]?.name??""} {product.endPercent}% </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/**
      <button 
        onClick={onCancel}
        className="mt-6 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
      >
        Cancel
      </button>
       */}
    </div>
  );
};

export default ProductsCRUD;