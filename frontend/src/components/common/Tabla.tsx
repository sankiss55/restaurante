import React from 'react';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ColumnaTabla {
  key: string;
  etiqueta: string;
  ancho?: string;
  render?: (valor: any, fila: any) => React.ReactNode;
  alineacion?: 'left' | 'center' | 'right';
}

interface TablaProps {
  columnas: ColumnaTabla[];
  datos: any[];
  acciones?: {
    editar?: (id: any) => void;
    eliminar?: (id: any) => void;
    ver?: (id: any) => void;
    custom?: {
      etiqueta: string;
      icono: React.ReactNode;
      onClick: (id: any) => void;
      variante?: 'default' | 'peligro' | 'exito';
    }[];
  };
  cargando?: boolean;
  sinDatos?: string;
}

const Tabla: React.FC<TablaProps> = ({
  columnas,
  datos,
  acciones,
  cargando = false,
  sinDatos = 'No hay datos disponibles',
}) => {
  const alineacionClases = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Encabezado */}
      <div className="grid gap-4 px-6 py-4 bg-[#E9EFE9]/50 border-b border-gray-100" style={{
        gridTemplateColumns: columnas.map(c => c.ancho || '1fr').join(' ') + (acciones ? ' auto' : ''),
      }}>
        {columnas.map((col) => (
          <div
            key={col.key}
            className={`text-[11px] font-bold text-gray-500 uppercase tracking-widest ${alineacionClases[col.alineacion || 'left']}`}
          >
            {col.etiqueta}
          </div>
        ))}
        {acciones && (
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right w-[100px]">
            Acciones
          </div>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col">
        {cargando ? (
          <div className="px-6 py-8 text-center">
            <div className="inline-block animate-spin">
              <div className="h-6 w-6 border-2 border-[#4F6A50] border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : datos.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            {sinDatos}
          </div>
        ) : (
          datos.map((fila, idx) => (
            <div
              key={idx}
              className={`grid gap-4 px-6 py-4 items-center ${
                idx !== datos.length - 1 ? 'border-b border-gray-50' : ''
              } hover:bg-gray-50/50 transition-colors`}
              style={{
                gridTemplateColumns: columnas.map(c => c.ancho || '1fr').join(' ') + (acciones ? ' auto' : ''),
              }}
            >
              {columnas.map((col) => (
                <div
                  key={col.key}
                  className={`text-gray-800 text-[15px] ${alineacionClases[col.alineacion || 'left']}`}
                >
                  {col.render ? col.render(fila[col.key], fila) : fila[col.key]}
                </div>
              ))}

              {acciones && (
                <div className="flex items-center justify-end gap-2 text-[#4F6A50] w-[100px]">
                  {acciones.ver && (
                    <button
                      onClick={() => acciones.ver?.(fila.id)}
                      className="p-1 hover:bg-[#E9EFE9] rounded-md transition-colors"
                      title="Ver"
                    >
                      <FiEye className="w-[18px] h-[18px]" />
                    </button>
                  )}

                  {acciones.editar && (
                    <button
                      onClick={() => acciones.editar?.(fila.id)}
                      className="p-1 hover:bg-[#E9EFE9] rounded-md transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 className="w-[18px] h-[18px]" />
                    </button>
                  )}
              
                 

                  {acciones.custom?.map((accion, i) => (
                    <button
                      key={i}
                      onClick={() => accion.onClick(fila.id)}
                      className={`p-1 rounded-md transition-colors ${
                        accion.variante === 'peligro'
                          ? 'text-red-600 hover:bg-red-50'
                          : accion.variante === 'exito'
                            ? 'text-green-600 hover:bg-green-50'
                            : 'hover:bg-[#E9EFE9]'
                      }`}
                      title={accion.etiqueta}
                    >
                      {accion.icono}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tabla;
