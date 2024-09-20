// components/ProductsCRUD.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  start: number;
  end: number;
  startPercentage: number;
  endPercentage: number;
}

interface Stage {
  id: string;
  name: string;
}

export function ProductsCRUD() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    start: 0,
    end: 0,
    startPercentage: 0,
    endPercentage: 100,
  });

  useEffect(() => {
    fetchProducts();
    fetchStages();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const fetchStages = async () => {
    const response = await fetch('/api/stages');
    const data = await response.json();
    setStages(data);
  };

  const handleAddProduct = async () => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    if (response.ok) {
      fetchProducts();
      setNewProduct({
        name: '',
        description: '',
        start: 0,
        end: 0,
        startPercentage: 0,
        endPercentage: 100,
      });
    }
  };

  const handleEditProduct = async (id: string, updatedProduct: Omit<Product, 'id'>) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
    if (response.ok) {
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchProducts();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Productos</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Nombre del producto"
        />
        <Input
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="Descripción del producto"
        />
        <Select value={newProduct.start.toString()} onValueChange={(value) => setNewProduct({ ...newProduct, start: Number(value) })}>
          <SelectTrigger>
            <SelectValue placeholder="Inicio" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage, index) => (
              <SelectItem key={stage.id} value={index.toString()}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={newProduct.startPercentage}
          onChange={(e) => setNewProduct({ ...newProduct, startPercentage: Number(e.target.value) })}
          placeholder="%"
          className="w-20"
        />
        <Select value={newProduct.end.toString()} onValueChange={(value) => setNewProduct({ ...newProduct, end: Number(value) })}>
          <SelectTrigger>
            <SelectValue placeholder="Fin" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage, index) => (
              <SelectItem key={stage.id} value={index.toString()}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={newProduct.endPercentage}
          onChange={(e) => setNewProduct({ ...newProduct, endPercentage: Number(e.target.value) })}
          placeholder="%"
          className="w-20"
        />
        <Button onClick={handleAddProduct} className="col-span-2 bg-[#10B981] text-white hover:bg-[#059669]">
          Agregar producto
        </Button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Lista de Productos</h3>
        <div className="space-y-2">
          {Array.isArray(products) && products.map((product) => (
            <div key={product.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{product.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    // Open a modal or form to edit the product
                    // For simplicity, we'll use prompt here
                    const newName = prompt('Enter new name', product.name);
                    if (newName) handleEditProduct(product.id, { ...product, name: newName });
                  }}>Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}