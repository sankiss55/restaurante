import React from 'react';

interface InputBusquedaProps {
  placeholder?: string;
  valor: string;
  onChange: (valor: string) => void;
  icono?: boolean;
  className?: string;
}

const InputBusqueda: React.FC<InputBusquedaProps> = ({
  placeholder = 'Buscar...',
  valor,
  onChange,
  icono = true,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {icono && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-[18px] h-[18px] text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      )}
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full
          ${icono ? 'pl-10' : 'pl-4'}
          pr-4
          py-2.5
          bg-white
          border border-gray-200
          rounded-xl
          text-sm
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-[#4F6A50]/50
          focus:border-[#4F6A50]
          transition-all
        `}
      />
    </div>
  );
};

export default InputBusqueda;
