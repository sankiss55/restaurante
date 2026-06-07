import React from 'react';
import Boton from '../../../components/common/Boton';
import type { ItemPedido, Mesa } from '../types';

interface PedidoResumenProps {
  mesa: Mesa | null;
  items: ItemPedido[];
  nota: string;
  total: number;
  onModificarCantidad: (idProducto: number, cantidad: number) => void;
  onEliminarItem: (idProducto: number) => void;
  onCambiarNota: (nota: string) => void;
  onEnviar: () => Promise<void>;
  enviando: boolean;
}

const PedidoResumen: React.FC<PedidoResumenProps> = ({
  mesa,
  items,
  nota,
  total,
  onModificarCantidad,
  onEliminarItem,
  onCambiarNota,
  onEnviar,
  enviando
}) => {
  if (!mesa) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">
        Selecciona una mesa para comenzar
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">📋 Mesa {mesa.numero_mesa}</h3>
        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
          {items.length} items
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No hay productos agregados
        </div>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {items.map(item => (
            <div
              key={item.id_producto}
              className="flex items-center justify-between bg-white p-2 rounded text-sm"
            >
              <div className="flex-1">
                <div className="font-semibold">{item.nombre}</div>
                <div className="text-xs text-gray-600">
                  ${item.precio.toFixed(2)} × {item.cantidad} = ${(item.precio * item.cantidad).toFixed(2)}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onModificarCantidad(item.id_producto, item.cantidad - 1)}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-xs"
                >
                  −
                </button>
                <button
                  onClick={() => onModificarCantidad(item.id_producto, item.cantidad + 1)}
                  className="px-2 py-1 bg-green-100 hover:bg-green-200 rounded text-xs"
                >
                  +
                </button>
                <button
                  onClick={() => onEliminarItem(item.id_producto)}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <>
          <textarea
            value={nota}
            onChange={(e) => onCambiarNota(e.target.value)}
            placeholder="Nota global del pedido..."
            className="w-full p-2 border rounded text-sm resize-none h-16"
          />

          <div className="flex justify-between items-center bg-white p-2 rounded font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Boton
            texto={enviando ? "Enviando..." : "Enviar Pedido"}
            variante="primario"
            onClick={onEnviar}
            className="w-full"
          />
        </>
      )}
    </div>
  );
};

export default PedidoResumen;
