import React from 'react';
import Cookies from 'js-cookie';
interface Mesa {
  id: string;
  nombre: string;
}

interface SelectorMesasProps {
  mesas: Mesa[];
  mesaSeleccionada: string | null;
  onSeleccionar: (mesaId: string) => void;
}

const SelectorMesas: React.FC<SelectorMesasProps> = ({
  mesas,
  mesaSeleccionada,
  onSeleccionar,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Seleccionar Mesa</h3>
      <div className="flex flex-col gap-2">
        {mesas.map((mesa) => (
          <button
            key={mesa.id}
            onClick={() => onSeleccionar(mesa.id)}
            className={`
              w-full px-4 py-3
              rounded-xl
              font-semibold
              text-left
              transition-all
              border-2
              ${
                mesaSeleccionada === mesa.id
                  ? 'bg-[#4F6A50] border-[#4F6A50] text-white'
                  : 'bg-white border-gray-200 text-gray-800 hover:border-[#4F6A50]'
              }
            `}
          >
            {mesa.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectorMesas;