import React, { useState } from 'react';

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

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Products</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="name"
          value={newProduct.name || ''}
          onChange={handleInputChange}
          placeholder="Product name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={newProduct.description || ''}
          onChange={handleInputChange}
          placeholder="Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          name="productType"
          value={editingProduct?.productType || newProduct.productType || ''}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Product Type</option>
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
          >
            <option value="">Select Segment</option>
            {segments.map(segment => (
              <option key={segment.id} value={segment.id}>{segment.name}</option>
            ))}
          </select>
        <div className="flex gap-4">
          <select
            name="startStageId"
            value={editingProduct?.startStageId || newProduct.startStageId || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Start Stage</option>
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="startPercent"
            value={newProduct.startPercent || ''}
            onChange={handleInputChange}
            placeholder="Start %"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            name="endStageId"
            value={editingProduct?.endStageId || newProduct.endStageId || ''}
            onChange={handleInputChange}
          >
            <option value="">Select End Stage</option>
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="endPercent"
            value={newProduct.endPercent || ''}
            onChange={handleInputChange}
            placeholder="End %"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {editingProduct ? 'Update' : 'Add'} Product
        </button>
        {editingProduct && (
          <button 
            type="button" 
            onClick={() => setEditingProduct(null)}
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel Edit
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
                  Edit
                </button>
                <button 
                  onClick={() => onSubmit('delete', { id: product.id })}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            {product.description && (
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            )}
            <span>Segment: {segments.filter(s => s.id === product.segmentId)[0]?.name??""}</span>
            <div className="text-sm text-gray-500">
              {product.startPercent !== undefined && (
                <span>Start: {stages.filter(s => s.id === product.startStageId)[0]?.name??""} {product.startPercent}% </span>
              )}<br />
              {product.endPercent !== undefined && (
                <span>End: {stages.filter(s => s.id === product.endStageId)[0]?.name??""} {product.endPercent}% </span>
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