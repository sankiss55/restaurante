import React from 'react';

interface CargadorProps {
  tamaño?: 'pequeño' | 'mediano' | 'grande';
  texto?: string;
}

const Cargador: React.FC<CargadorProps> = ({ tamaño = 'mediano', texto }) => {
  const tamaños = {
    pequeño: 'w-6 h-6',
    mediano: 'w-12 h-12',
    grande: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="animate-spin">
        <div
          className={`${tamaños[tamaño]} border-4 border-gray-200 border-t-[#4F6A50] rounded-full`}
        ></div>
      </div>
      {texto && <p className="text-gray-600 font-medium">{texto}</p>}
    </div>
  );
};

export default Cargador;
