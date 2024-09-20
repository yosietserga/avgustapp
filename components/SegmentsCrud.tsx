import React, { useState } from 'react';

interface Segment {
  id: number;
  name: string;
  objectiveId: number;
}

interface SegmentsCRUDProps {
  results: Segment[];
  objectiveId: number;
  onSubmit: (action: 'add' | 'edit' | 'delete', segment: Partial<Segment>) => void;
  onCancel: () => void;
}

const SegmentsCRUD: React.FC<SegmentsCRUDProps> = ({ results, objectiveId, onSubmit, onCancel }) => {
  const [newSegmentName, setNewSegmentName] = useState('');
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSegment) {
      onSubmit('edit', { id: editingSegment.id, name: newSegmentName });
    } else {
      onSubmit('add', { name: newSegmentName, objectiveId });
    }
    setNewSegmentName('');
    setEditingSegment(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Segments</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newSegmentName}
            onChange={(e) => setNewSegmentName(e.target.value)}
            placeholder="Segment name"
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            {editingSegment ? 'Update' : 'Add'} Segment
          </button>
        </div>
        {editingSegment && (
          <button 
            type="button" 
            onClick={() => setEditingSegment(null)}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel Edit
          </button>
        )}
      </form>
      <ul className="space-y-4">
        {Array.isArray(results) && results.map((segment) => (
          <li key={segment.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
            <span className="text-gray-800">{segment.name}</span>
            <div className="space-x-2">
              <button 
                onClick={() => {
                  setEditingSegment(segment);
                  setNewSegmentName(segment.name);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => onSubmit('delete', { id: segment.id })}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button 
        onClick={onCancel}
        className="mt-6 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
      >
        Cancel
      </button>
    </div>
  );
};

export default SegmentsCRUD;