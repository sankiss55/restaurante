import React from 'react';
import Boton from '../../../components/common/Boton';

interface ItemOrden {
  nombre?: string;
  cantidad?: number;
  notas?: string;
  nombre_producto?: string;
  producto_cantidad?: number;
  nota?: string;
}

interface TarjetaOrdenCocinaProps {
  id: string;
  mesa: string;
  items: ItemOrden[];
  tiempoDecorrido: string;
  estado: 'pendiente' | 'en-preparacion' | 'listo';
  notaGlobal?: string;
  onMarcarListo: () => void;
  buttonText?: string;
}

const TarjetaOrdenCocina: React.FC<TarjetaOrdenCocinaProps> = ({
  id,
  mesa,
  items,
  tiempoDecorrido,
  estado,
  notaGlobal,
  onMarcarListo,
  buttonText,
}) => {
  const estadoConfig: any = {
    pendiente: { bg: 'bg-red-100', text: 'text-red-700', badge: 'PENDIENTE' },
    'en-preparacion': { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'EN PREPARACIÓN' },
    listo: { bg: 'bg-green-100', text: 'text-green-700', badge: 'LISTO' },
  };

  const config = estadoConfig[estado] || estadoConfig['pendiente'];

  // Normalizar nombres de propiedades
  const getNombre = (item: ItemOrden) => item.nombre_producto || item.nombre || '';
  const getCantidad = (item: ItemOrden) => item.producto_cantidad || item.cantidad || 0;
  const getNotas = (item: ItemOrden) => item.nota || item.notas || '';

  return (
    <div className={`rounded-2xl border-2 p-5 space-y-4 ${config.bg}`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-2xl font-bold">T{id}</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${config.text}`}>
              {config.badge}
            </span>
          </div>
          <p className={`text-sm font-semibold ${config.text}`}>Mesa {mesa}</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${config.text}`}>{tiempoDecorrido}</p>
          <p className={`text-xs ${config.text}`}>minutos</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 bg-white/50 p-3 rounded-lg">
        {items && items.length > 0 ? (
          items.map((item, idx) => {
            const nombre = getNombre(item);
            const cantidad = getCantidad(item);
            const notas = getNotas(item);
            return (
              <div key={idx} className="flex items-baseline gap-2">
                <span className="font-bold text-lg">×{cantidad}</span>
                <span className="font-semibold text-gray-900">{nombre}</span>
                {notas && (
                  <span className="text-xs text-gray-600 italic ml-auto">• {notas}</span>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 text-sm">Sin items</p>
        )}
      </div>

      {/* Nota Global */}
      {notaGlobal && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <p className="text-xs font-semibold text-blue-900 mb-1">📝 NOTA GLOBAL:</p>
          <p className="text-sm text-blue-800 italic">{notaGlobal}</p>
        </div>
      )}

      {/* Botón de acción */}
      {estado !== 'listo' && (
        <Boton
          texto={buttonText || (estado === 'pendiente' ? 'Iniciar Preparación' : 'Marcar como Listo')}
          variante="primario"
          onClick={onMarcarListo}
          className="w-full"
        />
      )}
    </div>
  );
};

export default TarjetaOrdenCocina;
