import React, { useState } from 'react';
import Boton from '../../../components/common/Boton';
import type { ItemPedido } from '../types';

export type { ItemPedido } from '../types';

interface ResumenPedidoProps {
  items: ItemPedido[];
  mesaSeleccionada: string | null;
  mesaNumero?: number | null;
  notaGlobal: string;
  enviando: boolean;
  onEliminar: (id: number) => void;
  onModificarCantidad: (id: number, cantidad: number) => void;
  onAgregarNota: (id: number, nota: string) => void;
  onCambiarNotaGlobal: (nota: string) => void;
  onEnviar: () => void;
}

const ResumenPedido: React.FC<ResumenPedidoProps> = ({
  items,
  mesaSeleccionada,
  mesaNumero,
  notaGlobal,
  enviando,
  onEliminar,
  onModificarCantidad,
  onAgregarNota,
  onCambiarNotaGlobal,
  onEnviar,
}) => {
  const [editandoNota, setEditandoNota] = useState<number | null>(null);
  const [notaTemporal, setNotaTemporal] = useState('');
  
  const handleClickEnviar = () => {
    console.log('=== ResumenPedido: Botón clickeado ===');
    console.log('items:', items);
    console.log('enviando:', enviando);
    onEnviar();
  };
  
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  const iniciarEdicionNota = (itemId: number, notaActual?: string) => {
    setEditandoNota(itemId);
    setNotaTemporal(notaActual || '');
  };

  const guardarNota = (itemId: number) => {
    onAgregarNota(itemId, notaTemporal);
    setEditandoNota(null);
    setNotaTemporal('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 flex flex-col h-full">
      <div>
        <h3 className="font-bold text-gray-900">Resumen del Pedido</h3>
        {mesaSeleccionada && (
          <p className="text-sm text-gray-500 mt-1">
            Mesa: <span className="font-semibold text-gray-900">{mesaNumero || mesaSeleccionada}</span>
          </p>
        )}
      </div>

      <div className="flex-1 space-y-3 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mx-auto text-gray-300 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="text-gray-500 text-sm">Agrega productos al pedido</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{item.nombre}</p>
                  {item.nota && !editandoNota ? (
                    <p className="text-xs text-gray-500 italic mt-1">{item.nota}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => onEliminar(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 3a2.25 2.25 0 00-2.25-2.25h-12a2.25 2.25 0 00-2.25 2.25l2.285 12.05a2.25 2.25 0 002.25 1.966h12a2.25 2.25 0 002.25-1.966l2.285-12.05zm-5.05 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Edición de notas del producto */}
              {editandoNota === item.id ? (
                <div className="mb-2 space-y-2">
                  <textarea
                    value={notaTemporal}
                    onChange={(e) => setNotaTemporal(e.target.value)}
                    placeholder="Ej: Sin cebolla, picante..."
                    className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#4F6A50]"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => guardarNota(item.id)}
                      className="flex-1 text-xs bg-[#4F6A50] text-white rounded py-1 hover:bg-[#3d5340]"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditandoNota(null)}
                      className="flex-1 text-xs bg-gray-300 text-gray-700 rounded py-1 hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => iniciarEdicionNota(item.id, item.nota)}
                  className="text-xs text-[#4F6A50] hover:text-[#3d5340] mt-1"
                >
                  {item.nota ? 'Editar nota' : 'Agregar nota'}
                </button>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onModificarCantidad(item.id, Math.max(1, item.cantidad - 1))
                    }
                    className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors text-xs"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => onModificarCantidad(item.id, item.cantidad + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-sm">$ {(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          {!mesaSeleccionada && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-700 font-semibold">⚠️ Selecciona una mesa primero</p>
            </div>
          )}
          {/* Nota global del pedido */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Nota del pedido:</label>
            <textarea
              value={notaGlobal}
              onChange={(e) => onCambiarNotaGlobal(e.target.value)}
              placeholder="Ej: Urgente, cliente especial..."
              className="w-full text-xs p-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#4F6A50]"
              rows={2}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-semibold">{totalItems}</span>
          </div>
          <div className="flex justify-between items-baseline bg-[#E9EFE9] p-3 rounded-lg">
            <span className="font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[#4F6A50]">$ {total.toFixed(2)}</span>
          </div>
          <Boton
            texto={enviando ? 'Enviando...' : 'Enviar a Cocina'}
            variante="primario"
            onClick={handleClickEnviar}
            className="w-full"
            deshabilitado={enviando || !mesaSeleccionada || items.length === 0}
          />
        </div>
      )}
    </div>
  );
};

export default ResumenPedido;
