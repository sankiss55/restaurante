import React from 'react';

interface BotonProps {
  texto: string;
  icono?: React.ReactNode;
  variante?: 'primario' | 'secundario' | 'peligro' | 'neutral';
  tamaño?: 'pequeño' | 'mediano' | 'grande';
  deshabilitado?: boolean;
  cargando?: boolean;
  onClick?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Boton: React.FC<BotonProps> = ({
  texto,
  icono,
  variante = 'primario',
  tamaño = 'mediano',
  deshabilitado = false,
  cargando = false,
  onClick,
  tipo = 'button',
  className = '',
}) => {
  const estilos = {
    primario: 'bg-[#4F6A50] hover:bg-[#3D553F] text-white shadow-sm shadow-[#4F6A50]/20',
    secundario: 'bg-[#E9EFE9] hover:bg-[#d8e3d8] text-[#4F6A50]',
    peligro: 'bg-red-600 hover:bg-red-700 text-white',
    neutral: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  };

  const tamaños = {
    pequeño: 'px-3 py-1.5 text-[12px]',
    mediano: 'px-5 py-2.5 text-sm',
    grande: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado || cargando}
      className={`
        flex items-center justify-center gap-2
        ${estilos[variante]}
        ${tamaños[tamaño]}
        rounded-xl
        font-semibold
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        active:scale-95
        ${className}
      `}
    >
      {cargando ? (
        <svg className="animate-spin -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icono
      )}
      {texto}
    </button>
  );
};

export default Boton;
