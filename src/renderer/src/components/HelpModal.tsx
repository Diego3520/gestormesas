import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Ayuda</h2>
        <div className="mb-4 space-y-2">
          <p><strong>Alquilar una mesa:</strong> Haga clic en el botón "Alquilar" en una mesa disponible.</p>
          <p><strong>Alquiler por tiempo:</strong> Ingrese la duración en horas antes de alquilar (máximo 20 horas).</p>
          <p><strong>Alquiler indefinido:</strong> Deje el campo de duración vacío al alquilar.</p>
          <p><strong>Finalizar alquiler:</strong> Haga clic en el botón "Finalizar" en una mesa ocupada.</p>
          <p><strong>Configuración:</strong> Use el botón de configuración para ajustar el número máximo de mesas o editar el precio por hora.</p>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

