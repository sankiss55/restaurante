import { useState, useCallback } from 'react';
import { meseroService } from '../services/meseroService';
import type { ItemPedido, Mesa } from '../types';

export const usePedido = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [nota, setNota] = useState('');
  const [enviando, setEnviando] = useState(false);

  const agregarProducto = useCallback((producto: any) => {
    const existente = items.find(i => i.id_producto === producto.id);
    
    if (existente) {
      setItems(items.map(i =>
        i.id_producto === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      setItems([...items, {
        id: Date.now(),
        id_producto: producto.id,
        nombre: producto.nombre,
        cantidad: 1,
        precio: producto.precio
      }]);
    }
  }, [items]);

  const modificarCantidad = useCallback((idProducto: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarProducto(idProducto);
    } else {
      setItems(items.map(i =>
        i.id_producto === idProducto ? { ...i, cantidad } : i
      ));
    }
  }, [items]);

  const eliminarProducto = useCallback((idProducto: number) => {
    setItems(items.filter(i => i.id_producto !== idProducto));
  }, [items]);

  const establecerNotaProducto = useCallback((idProducto: number, notaProducto: string) => {
    setItems(items.map(i =>
      i.id_producto === idProducto ? { ...i, nota: notaProducto } : i
    ));
  }, [items]);

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  const enviar = async (idUsuario: number) => {
    if (!mesaSeleccionada || items.length === 0) return;

    try {
      setEnviando(true);
      const total = calcularTotal();
      await meseroService.crearOrdenConDetalles({
        id_mesa: mesaSeleccionada.id,
        usuario_atencion: idUsuario,
        id_estado: 1,
        total,
        nota: nota || '',
        detalles: items.map(item => ({
  id_producto: item.id_producto,
  nombre_producto: item.nombre,
  precio_unitario: Number(item.precio),    
  producto_cantidad: item.cantidad,
  nota: item.nota || '',
  sub_total: item.cantidad * Number(item.precio),  
}))
      });

      limpiar();
    }catch(error:any){
 console.log('❌ Status:', error.response?.status);
  console.log('❌ Mensaje del server:', error.response?.data);  
    } finally {
      setEnviando(false);
    }
  };

  const limpiar = () => {
    setItems([]);
    setNota('');
  };

  return {
    mesaSeleccionada,
    setMesaSeleccionada,
    items,
    nota,
    setNota,
    agregarProducto,
    modificarCantidad,
    eliminarProducto,
    establecerNotaProducto,
    calcularTotal,
    enviar,
    enviando
  };
};
