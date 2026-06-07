import React from 'react';

interface ProductoMenuProps {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  onAgregar: (id: number) => void;
}

const ProductoMenu: React.FC<ProductoMenuProps> = ({
  id,
  nombre,
  descripcion,
  precio,
  onAgregar,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 hover:shadow-md transition-shadow">
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{nombre}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{descripcion}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-[#4F6A50]">$ {precio.toFixed(2)}</span>
        <button
          onClick={() => onAgregar(id)}
          className="p-2 rounded-lg bg-[#E9EFE9] text-[#4F6A50] hover:bg-[#d8e3d8] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductoMenu;
