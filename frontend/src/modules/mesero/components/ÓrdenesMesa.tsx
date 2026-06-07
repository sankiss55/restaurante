import React, { useState, useEffect } from 'react';
import Boton from '../../../components/common/Boton';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { CambiarOrdenPagada } from '../../../services/ordenesService';
import { useToast } from '../../../hooks/useToast';

interface Orden {
  id: number;
  id_mesa: { id: number; numero_mesa: number };
  id_estado: any;
  total: number;
  nota?: string;
  created_at: string;
  detalles?: any[];
}

interface ÓrdenesMesaProps {
  mesaId: number;
}

const ÓrdenesMesa: React.FC<ÓrdenesMesaProps> = ({ mesaId }) => {
  const { ordenes } = useWebSocket('mesero');
  const [ordenesMesa, setOrdenesMesa] = useState<Orden[]>([]);
  const [procesando, setProcesando] = useState<number | null>(null);
  const { error, informacion } = useToast();

  useEffect(() => {
    console.log('[ÓrdenesMesa] 📍 Mesa:', mesaId, 'Órdenes totales:', ordenes.length);
    
    // Filtrar órdenes de esta mesa que están Preparando (2) o Listo (3)
    const filtered = ordenes.filter(o => 
      o.id_mesa?.id === mesaId && [2, 3].includes(typeof o.id_estado === 'object' ? o.id_estado?.id : o.id_estado)
    );
    
    console.log('[ÓrdenesMesa] 🔍 Órdenes encontradas:', filtered.length);
    setOrdenesMesa(filtered);
  }, [ordenes, mesaId]);

  const handleMarcarPagado = async (ordenId: number) => {
    try {
      setProcesando(ordenId);
      console.log('[ÓrdenesMesa] 💳 Marcando orden como pagada:', ordenId);
      await CambiarOrdenPagada(ordenId);
      informacion('✅ Orden marcada como pagada');
    } catch (err) {
      console.error('Error al marcar pagado:', err);
      error('Error al marcar la orden como pagada');
    } finally {
      setProcesando(null);
    }
  };

  if (ordenesMesa.length === 0) {
    return null; // No mostrar el componente si no hay órdenes
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">📦 Órdenes Activas en la Mesa</h3>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {ordenesMesa.map((orden) => {
          const estadoId = typeof orden.id_estado === 'object' ? orden.id_estado.id : orden.id_estado;
          const estadoNombre = estadoId === 2 ? '👨‍🍳 Preparando' : '✅ Listo para entregar';
          const estadoColor = estadoId === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
          
          return (
            <div key={orden.id} className={`${estadoColor} p-3 rounded-lg border border-current`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">Orden #{orden.id}</p>
                  <p className="text-xs">{new Date(orden.created_at).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</p>
                </div>
                <span className="text-xs font-bold">{estadoNombre}</span>
              </div>
              
              {/* Items */}
              <div className="text-sm space-y-1 mb-2">
                {orden.detalles && orden.detalles.map((item, idx) => (
                  <div key={idx}>
                    <span className="font-semibold">×{item.producto_cantidad}</span> {item.nombre_producto}
                    {item.nota && <span className="text-xs italic text-gray-600"> • {item.nota}</span>}
                  </div>
                ))}
              </div>

              {/* Nota global */}
              {orden.nota && (
                <p className="text-xs italic bg-blue-50 p-1 rounded border-l-2 border-blue-400">
                  📝 {orden.nota}
                </p>
              )}

              {/* Monto */}
              <p className="text-sm font-bold mt-2">Total: ${orden.total.toFixed(2)}</p>

              {/* Botón Marcar Pagado - solo para órdenes Listo (3) */}
              {estadoId === 3 && (
                <Boton
                  texto={procesando === orden.id ? "⏳ Procesando..." : "💳 Marcar Pagado"}
                  variante="primario"
                  onClick={() => handleMarcarPagado(orden.id)}
                  className="w-full mt-2 text-xs py-1"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ÓrdenesMesa;
