import { useEffect, useState, useCallback } from 'react';
import websocketService from '../services/websocketService';
import api from '../services/api';

interface Orden {
  id: number;
  id_mesa: { id: number; numero_mesa: number };
  id_estado: { id: number } | number;
  total: number;
  nota?: string;
  created_at: string;
  detalles?: any[];
  [key: string]: any;
}

export const useWebSocket = (rol?: string) => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [conectado, setConectado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Hook] 📍 useEffect ejecutado, rol:', rol);
    
    if (!rol) {
      console.log('[Hook] ❌ rol no definido, retornando');
      return;
    }

    console.log('[Hook] 🎯 Iniciando useWebSocket con rol:', rol);

    // Flag para evitar state updates después de desmontar
    let isMounted = true;

    // Conectar al WebSocket
    const conectarWS = async () => {
      try {
        console.log('[Hook] ⏳ Conectando a WebSocket...');
        
        await websocketService.conectar(rol);
        
        if (!isMounted) return; // Componente desmontado
        
        console.log('[Hook] ✅ WebSocket conectado');
        setConectado(true);

        // Definir el manejador de órdenes actualizadas
        const handleOrdenActualizada = (data: any) => {
          if (!isMounted) return;
          const orden = data.data || data;
          console.log('[Hook] 📥 Orden actualizada recibida en WebSocket:', orden);
          setOrdenes((prev) => {
            // Buscar si la orden ya existe
            const index = prev.findIndex((o) => o.id === orden.id);
            if (index >= 0) {
              // Actualizar orden existente
              const updated = [...prev];
              updated[index] = orden;
              console.log('[Hook] 🔄 Orden actualizada (actualización)', updated[index]);
              return updated;
            } else {
              // Agregar nueva orden si no existe
              console.log('[Hook] ➕ Orden nueva agregada:', orden);
              return [...prev, orden];
            }
          });
        };

        // Suscribirse DESPUÉS de conectar
        websocketService.escucharActualizaciones(handleOrdenActualizada);
        websocketService.escucharEstadoCambiado(handleOrdenActualizada);
        
        // Suscribirse a eventos de mesa liberada
        websocketService.escucharMesaLiberada((data: any) => {
          if (!isMounted) return;
          console.log('[Hook] 🔓 Mesa liberada recibida:', data);
          // Disparar evento custom para que componentes externos lo escuchen
          window.dispatchEvent(new CustomEvent('mesa-liberada', { detail: data }));
        });

        // Cargar órdenes existentes según el rol
        let estados: number[] = [];
        if (rol === 'cocinero') {
          estados = [1, 2]; // Pendiente + Preparando
          console.log('[Hook] 🏪 Cocinero: cargando órdenes con estados', estados);
        } else if (rol === 'mesero') {
          estados = [2, 3]; // Preparando + Listo
          console.log('[Hook] 🍽️ Mesero: cargando órdenes con estados', estados);
        }

        // Llamar al endpoint para cargar órdenes existentes
        try {
          console.log('[Hook] 📡 Llamando POST /ordenes/listar/estados con:', {estados});
          const response = await api.post('/ordenes/listar/estados', { estados });
          console.log('[Hook] 📨 Respuesta recibida:', response.data);
          
          if (!isMounted) return;
          
          if (response.data?.status === 'success' && Array.isArray(response.data?.data)) {
            console.log('[Hook] ✅ Órdenes cargadas:', response.data.data.length, 'órdenes');
            setOrdenes(response.data.data);
          } else {
            console.warn('[Hook] ⚠️ Respuesta inesperada:', response.data);
          }
        } catch (error: any) {
          console.error('[Hook] ❌ Error cargando órdenes existentes:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
          });
        }
      } catch (error) {
        console.error('[Hook] ❌ Error conectando WS:', error);
        if (isMounted) {
          setConectado(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    conectarWS();

    // Cleanup
    return () => {
      isMounted = false;
      websocketService.desconectar();
    };
  }, [rol]);

  const cambiarEstado = useCallback(
    (ordenId: number, nuevoEstado: number) => {
      websocketService.cambiarEstadoOrden(ordenId, nuevoEstado, rol || '');
    },
    [rol]
  );

  const filtrarOrdenesPorEstado = useCallback(
    (estados: number[]): Orden[] => {
      return ordenes.filter((orden) => {
        const estadoId = typeof orden.id_estado === 'object' ? orden.id_estado?.id : orden.id_estado;
        return estados.includes(estadoId || 0);
      });
    },
    [ordenes]
  );

  const obtenerOrdenesPorMesa = useCallback(
    (idMesa: number, estados: number[]): Orden[] => {
      return ordenes.filter((orden) => {
        const estadoId = typeof orden.id_estado === 'object' ? orden.id_estado?.id : orden.id_estado;
        return (
          orden.id_mesa?.id === idMesa &&
          estados.includes(estadoId || 0)
        );
      });
    },
    [ordenes]
  );

  return {
    ordenes,
    conectado,
    loading,
    cambiarEstado,
    filtrarOrdenesPorEstado,
    obtenerOrdenesPorMesa,
    setOrdenes,
  };
};
