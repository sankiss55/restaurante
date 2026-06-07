import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useWebSocket } from '../../../hooks/useWebSocket';
import TarjetaOrdenCocina from '../components/TarjetaOrdenCocina';

const PedidosActivos: React.FC = () => {
  const { rol } = useAuth();
  
  console.log('[PedidosActivos] ✅ Componente renderizado con rol:', rol);
  
  const { ordenes, conectado, loading, cambiarEstado, filtrarOrdenesPorEstado } = useWebSocket(rol || undefined);
  const [tiemposDecorridos, setTiemposDecorridos] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    console.log('[PedidosActivos] 🎯 Rol cambió a:', rol);
  }, [rol]);
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevosTiempos: { [key: number]: string } = {};
      ordenes.forEach((orden) => {
        if (orden.created_at) {
          const minutos = Math.floor((Date.now() - new Date(orden.created_at).getTime()) / 60000);
          nuevosTiempos[orden.id] = minutos.toString();
        }
      });
      setTiemposDecorridos(nuevosTiempos);
    }, 1000);

    return () => clearInterval(interval);
  }, [ordenes]);

  const handleMarcarPreparando = (id: number) => {
    cambiarEstado(id, 2); // Cambiar a Preparando
  };

  const handleMarcarListo = (id: number) => {
    cambiarEstado(id, 3); // Cambiar a Listo (desaparece de esta vista)
  };

  // Filtrar órdenes: Solo Pendiente (1) + Preparando (2) 
  const ordenesPendientes = filtrarOrdenesPorEstado([1]);
  const ordenesEnPreparacion = filtrarOrdenesPorEstado([2]);

  if (!conectado && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold">No conectado al sistema en tiempo real</p>
        <p className="text-red-500 text-sm mt-2">Intenta recargar la página</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado de conexión */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${conectado ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}
        ></div>
        <span className={`text-sm font-medium ${conectado ? 'text-green-600' : 'text-red-600'}`}>
          {conectado ? 'Conectado' : 'Desconectado'}
        </span>
      </div>

      {/* Órdenes Pendientes */}
      {ordenesPendientes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Órdenes Pendientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordenesPendientes.map((orden) => (
              <TarjetaOrdenCocina
                key={orden.id}
                id={orden.id.toString()}
                mesa={orden.id_mesa?.numero_mesa.toString() || 'N/A'}
                items={orden.detalles || []}
                tiempoDecorrido={tiemposDecorridos[orden.id] || '0'}
                estado="pendiente"
                notaGlobal={orden.nota}
                onMarcarListo={() => handleMarcarPreparando(orden.id)}
                buttonText="Preparar"
              />
            ))}
          </div>
        </div>
      )}

      {/* Órdenes en Preparación */}
      {ordenesEnPreparacion.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Órdenes en Preparación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordenesEnPreparacion.map((orden) => (
              <TarjetaOrdenCocina
                key={orden.id}
                id={orden.id.toString()}
                mesa={orden.id_mesa?.numero_mesa.toString() || 'N/A'}
                items={orden.detalles || []}
                tiempoDecorrido={tiemposDecorridos[orden.id] || '0'}
                estado="en-preparacion"
                notaGlobal={orden.nota}
                onMarcarListo={() => handleMarcarListo(orden.id)}
                buttonText="Marcar Listo"
              />
            ))}
          </div>
        </div>
      )}

      
      {/* Sin órdenes */}
      {ordenesPendientes.length === 0 && ordenesEnPreparacion.length === 0  && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.566.034-1.08.16-1.123.08m0 0A2.25 2.25 0 006.75 4.5M6.75 4.5a2.25 2.25 0 00-2.25 2.25m0 0V15a2.25 2.25 0 002.25 2.25m0-16.5v16.5h13.5V6.75M6.75 19.5h0.008v.008H6.75v-.008Z"
            />
          </svg>
          <p className="text-gray-500 font-semibold text-lg mt-2">No hay órdenes pendientes</p>
          <p className="text-gray-400 text-sm mt-1">Esperando nuevas órdenes...</p>
        </div>
      )}
    </div>
  );
};

export default PedidosActivos;
