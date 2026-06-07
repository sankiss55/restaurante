import React from 'react';

interface TarjetaEstadisticaProps {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string | number;
  descripcion?: string;
  variante?: 'default' | 'destacado';
}

const TarjetaEstadistica: React.FC<TarjetaEstadisticaProps> = ({
  icono,
  etiqueta,
  valor,
  descripcion,
  variante = 'default',
}) => {
  const estilos = {
    default: 'bg-white border border-gray-200',
    destacado: 'bg-[#4F6A50] text-white shadow-lg shadow-[#4F6A50]/20',
  };

  return (
    <div className={`p-6 rounded-2xl ${estilos[variante]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${variante === 'destacado' ? 'bg-white/20' : 'bg-[#E9EFE9]'}`}>
          <div className={variante === 'destacado' ? 'text-white' : 'text-[#4F6A50]'}>
            {icono}
          </div>
        </div>
      </div>
      
      <p className={`text-[11px] font-bold tracking-widest uppercase mb-2 ${variante === 'destacado' ? 'text-white/80' : 'text-gray-500'}`}>
        {etiqueta}
      </p>
      
      <p className={`text-3xl font-bold mb-2 ${variante === 'destacado' ? 'text-white' : 'text-gray-900'}`}>
        {valor}
      </p>
      
      {descripcion && (
        <p className={`text-sm ${variante === 'destacado' ? 'text-white/70' : 'text-gray-600'}`}>
          {descripcion}
        </p>
      )}
    </div>
  );
};

export default TarjetaEstadistica;
