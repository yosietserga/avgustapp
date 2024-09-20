import React, { useState } from 'react';

interface Stage {
  id: number;
  name: string;
  order: number;
  objectiveId: number;
}

interface StagesCRUDProps {
  results: Stage[];
  objectiveId: number;
  onSubmit: (action: 'add' | 'edit' | 'delete', stage: Partial<Stage>) => void;
  onCancel: () => void;
}

const StagesCRUD: React.FC<StagesCRUDProps> = ({ results, objectiveId, onSubmit, onCancel }) => {
  const [newStageName, setNewStageName] = useState('');
  const [newStageOrder, setNewStageOrder] = useState('');
  const [editingStage, setEditingStage] = useState<Stage | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStage) {
      onSubmit('edit', { id: editingStage.id, name: newStageName, order: parseInt(newStageOrder), objectiveId });
    } else {
      onSubmit('add', { name: newStageName, order: parseInt(newStageOrder) });
    }
    setNewStageName('');
    setNewStageOrder('');
    setEditingStage(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Stages</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            placeholder="Stage name"
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={newStageOrder}
            onChange={(e) => setNewStageOrder(e.target.value)}
            placeholder="Order"
            required
            className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {editingStage ? 'Update' : 'Add'} Stage
        </button>
        {editingStage && (
          <button 
            type="button" 
            onClick={() => setEditingStage(null)}
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel Edit
          </button>
        )}
      </form>
      <ul className="space-y-4">
        {Array.isArray(results) && results.map((stage) => (
          <li key={stage.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
            <div>
              <span className="text-gray-800 font-medium">{stage.name}</span>
              <span className="ml-2 text-sm text-gray-500">Order: {stage.order}</span>
            </div>
            <div className="space-x-2">
              <button 
                onClick={() => {
                  setEditingStage(stage);
                  setNewStageName(stage.name);
                  setNewStageOrder(stage.order.toString());
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => onSubmit('delete', { id: stage.id })}
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

export default StagesCRUD;