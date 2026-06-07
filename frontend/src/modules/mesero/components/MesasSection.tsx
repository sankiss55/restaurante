import React from 'react';
import type { Mesa } from '../types';

interface MesasSectionProps {
  mesasAtendidas: Mesa[];
  mesasDisponibles: Mesa[];
  mesaSeleccionada: Mesa | null;
  onSeleccionarMesa: (mesa: Mesa) => void;
  cargando: boolean;
}

const MesasSection: React.FC<MesasSectionProps> = ({
  mesasAtendidas,
  mesasDisponibles,
  mesaSeleccionada,
  onSeleccionarMesa,
  cargando
}) => {
  if (cargando) {
    return <div className="p-4 text-center">Cargando mesas...</div>;
  }

  return (
    <div className="space-y-4">
      {mesasAtendidas.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-blue-900 mb-2">📍 Mis Mesas</h3>
          <div className="grid grid-cols-2 gap-2">
            {mesasAtendidas.map(mesa => (
              <button
                key={mesa.id}
                onClick={() => onSeleccionarMesa(mesa)}
                className={`p-3 rounded border-2 transition ${
                  mesaSeleccionada?.id === mesa.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className="font-bold">Mesa {mesa.numero_mesa}</div>
                <div className="text-xs text-gray-600">En atención</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {mesasDisponibles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">🟢 Mesas Disponibles</h3>
          <div className="grid grid-cols-2 gap-2">
            {mesasDisponibles.map(mesa => (
              <button
                key={mesa.id}
                onClick={() => onSeleccionarMesa(mesa)}
                className="p-3 rounded border-2 border-gray-300 hover:border-gray-400 transition"
              >
                <div className="font-bold">Mesa {mesa.numero_mesa}</div>
                <div className="text-xs text-gray-500">Disponible</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {mesasAtendidas.length === 0 && mesasDisponibles.length === 0 && (
        <div className="p-4 text-center text-gray-500">No hay mesas disponibles</div>
      )}
    </div>
  );
};

export default MesasSection;
