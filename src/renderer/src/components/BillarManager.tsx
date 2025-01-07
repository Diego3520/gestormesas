import React, { useState, useEffect } from 'react';
import { Table } from './Table';
import { ConfigModal } from './ConfigModal';
import { HelpModal } from './HelpModal';
import { QuestionMarkCircleIcon, CogIcon } from '@heroicons/react/24/outline';
import backgroundImage from '../assets/background.jpg'; // Importa la imagen de fondo

interface TableData {
  id: number;
  status: 'available' | 'occupied';
  startTime: number | null;
  endTime: number | null;
  rentType: 'indefinite' | 'timed';
}

export const BillarManager: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [maxTables, setMaxTables] = useState(5);
  const [costPerHour, setCostPerHour] = useState(18); // Estado para el costo por hora
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    setTables(Array.from({ length: maxTables }, (_, i) => ({
      id: i + 1,
      status: 'available',
      startTime: null,
      endTime: null,
      rentType: 'indefinite',
    })));
  }, [maxTables]);

  const handleTableRent = (id: number, rentType: 'indefinite' | 'timed', duration?: number) => {
    setTables(tables.map(table => {
      if (table.id === id) {
        const now = Date.now();
        return {
          ...table,
          status: 'occupied',
          startTime: now,
          endTime: rentType === 'timed' ? now + (duration || 0) * 60000 : null,
          rentType,
        };
      }
      return table;
    }));
  };

  const handleTableRelease = (id: number) => {
    setTables(tables.map(table => {
      if (table.id === id) {
        return {
          ...table,
          status: 'available',
          startTime: null,
          endTime: null,
          rentType: 'indefinite',
        };
      }
      return table;
    }));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div className="container mx-auto p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Gestor de Mesas de Billar</h1>
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={() => setShowHelpModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
            Ayuda
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center"
          >
            <CogIcon className="h-5 w-5 mr-2" />
            Configuración
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map(table => (
            <Table
              key={table.id}
              table={table}
              costPerHour={costPerHour} // Pasar el costo por hora aquí
              onRent={handleTableRent}
              onRelease={handleTableRelease}
            />
          ))}
        </div>
        {showConfigModal && (
          <ConfigModal
            maxTables={maxTables}
            costPerHour={costPerHour} // Pasar el costo por hora aquí
            onSave={(newMaxTables, newCostPerHour) => {
              setMaxTables(newMaxTables);
              setCostPerHour(newCostPerHour);
              setShowConfigModal(false);
            }}
            onClose={() => setShowConfigModal(false)}
          />
        )}
        {showHelpModal && (
          <HelpModal onClose={() => setShowHelpModal(false)} />
        )}
      </div>
    </div>
  );
};

export default BillarManager;
