import React, { useState } from 'react';

interface ConfigModalProps {
  maxTables: number;
  costPerHour?: number; // Nueva prop para el costo por hora, opcional
  onSave: (newMaxTables: number, newCostPerHour: number) => void;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ maxTables, costPerHour = 18, onSave, onClose }) => {
  const [newMaxTables, setNewMaxTables] = useState(maxTables);
  const [newCostPerHour, setNewCostPerHour] = useState(costPerHour); // Nuevo estado para el costo por hora

  const handleSave = () => {
    onSave(newMaxTables, newCostPerHour); // Pasamos el nuevo costo por hora al guardar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Configuración</h2>
        <div className="mb-4">
          <label htmlFor="maxTables" className="block mb-2">Número máximo de mesas:</label>
          <input
            type="number"
            id="maxTables"
            value={newMaxTables}
            onChange={(e) => setNewMaxTables(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="costPerHour" className="block mb-2">Costo por hora (Bs):</label>
          <input
            type="number"
            id="costPerHour"
            value={newCostPerHour}
            onChange={(e) => setNewCostPerHour(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
            step="0.01"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
