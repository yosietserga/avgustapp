import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Country {
  id: number;
  nombre: string;
  code: string;
}

interface CropFormProps {
  cropId?: number;
  onSubmit: (crop: { name: string; description?: string; image?: string; country_id: number }) => void;
  onCancel: () => void;
}

const CropForm: React.FC<CropFormProps> = ({ cropId, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [countryId, setCountryId] = useState<number | ''>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
    if (cropId) {
      fetchCropData();
    }
  }, [cropId]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries');
      setCountries(response.data);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError('Failed to fetch countries');
    }
  };

  const fetchCropData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/crops/${cropId}`);
      const crop = response.data;
      setName(crop.name);
      setDescription(crop.description || '');
      setImage(crop.image || '');
      setCountryId(crop.countryId);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch crop data:', err);
      setError('Failed to fetch crop data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!countryId) {
      setError('Country is required');
      return;
    }
    onSubmit({ name, description, image, country_id: Number(countryId) });
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Cultivo:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Selecciona País:</label>
        <select
          id="country"
          value={countryId}
          onChange={(e) => setCountryId(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Selecciona...</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>{country.nombre}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {cropId ? 'Guardar' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CropForm;