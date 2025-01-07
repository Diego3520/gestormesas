import React, { useState, useEffect } from 'react';
import { ClockIcon, CurrencyDollarIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';

interface TableProps {
  table: {
    id: number;
    status: 'available' | 'occupied';
    startTime: number | null;
    endTime: number | null;
    rentType: 'indefinite' | 'timed';
  };
  costPerHour: number;  // Propiedad para el costo por hora
  onRent: (id: number, rentType: 'indefinite' | 'timed', duration?: number) => void;
  onRelease: (id: number) => void;
}

export const Table: React.FC<TableProps> = ({ table, costPerHour, onRent, onRelease }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rentDuration, setRentDuration] = useState('');
  const [timeEnded, setTimeEnded] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastRentDuration, setLastRentDuration] = useState(0);
  const [lastRentCost, setLastRentCost] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (table.status === 'occupied' && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - (table.startTime || 0)) / 1000);
        setElapsedTime(elapsed);

        // Verificar si la mesa con tiempo limitado ha llegado a su fin
        if (table.rentType === 'timed' && table.endTime && now >= table.endTime) {
          const hours = (table.endTime - (table.startTime || 0)) / 3600000; // Calcular horas basadas en tiempo de inicio y fin
          const cost = Math.ceil(hours * costPerHour); // Calcular costo basado en horas
          setTotalCost(cost);
          setTimeEnded(true);
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [table.status, table.startTime, table.endTime, table.rentType, onRelease, table.id, costPerHour, isPaused]);

  const handleRent = () => {
    if (table.status === 'available') {
      if (rentDuration) {
        const duration = parseFloat(rentDuration);
        if (duration > 0 && duration <= 20) {
          onRent(table.id, 'timed', duration * 60);
        } else {
          alert('La duración debe ser entre 0 y 20 horas.');
        }
      } else {
        onRent(table.id, 'indefinite');
      }
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRelease = () => {
    setLastRentDuration(elapsedTime);
    setLastRentCost(calculateCost());
    onRelease(table.id);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateCost = () => {
    const hours = elapsedTime / 3600;
    return Math.ceil(hours * costPerHour); // Usar la propiedad costPerHour
  };

  return (
    <div className={`border p-4 rounded-lg shadow-md ${timeEnded ? 'bg-yellow-300' : table.status === 'available' ? 'bg-green-300' : 'bg-red-300'} transition-all duration-300 ease-in-out transform hover:scale-105`}>
      <h2 className="text-xl font-bold mb-2">Mesa {table.id}</h2>
      <p className="mb-2">Estado: {table.status === 'available' ? 'Disponible' : timeEnded ? 'Tiempo terminado' : 'Ocupada'}</p>
      {table.status === 'occupied' && (
        <>
          <p className="mb-2">Tiempo transcurrido: {formatTime(elapsedTime)}</p>
          <p className="mb-2">Costo actual: {calculateCost()} Bs</p>
          <button
            onClick={handlePause}
            className={`w-full ${isPaused ? 'bg-green-500 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-700'} text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center mb-2`}
          >
            {isPaused ? (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                Reanudar
              </>
            ) : (
              <>
                <PauseIcon className="h-5 w-5 mr-2" />
                Pausar
              </>
            )}
          </button>
        </>
      )}
      {timeEnded && (
        <p className="mb-2">Costo total: {totalCost} Bs</p>
      )}
      {table.status === 'available' && (
        <>
          <div className="mb-2">
            <input
              type="number"
              value={rentDuration}
              onChange={(e) => setRentDuration(e.target.value)}
              placeholder="Duración (horas)"
              className="w-full p-2 border rounded"
              min="0"
              max="20"
              step="0.5"
            />
          </div>
          {lastRentDuration > 0 && (
            <>
              <p className="mb-2">Último tiempo alquilado: {formatTime(lastRentDuration)}</p>
              <p className="mb-2">Último costo: {lastRentCost} Bs</p>
            </>
          )}
        </>
      )}
      <button
        onClick={table.status === 'available' ? handleRent : timeEnded ? () => setTimeEnded(false) : handleRelease}
        className={`w-full ${table.status === 'available' ? 'bg-blue-500 hover:bg-blue-700' : timeEnded ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-red-500 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center`}
      >
        {table.status === 'available' ? (
          <>
            <ClockIcon className="h-5 w-5 mr-2" />
            Alquilar
          </>
        ) : timeEnded ? (
          <>
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Finalizar
          </>
        ) : (
          <>
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Liberar
          </>
        )}
      </button>
    </div>
  );
};
