import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Producto, Categoria } from '../types';

interface ProductosSectionProps {
  productos: Producto[];
  categorias: Categoria[];
  onSeleccionarProducto: (producto: Producto) => void;
  cargando: boolean;
}

const ProductosSection: React.FC<ProductosSectionProps> = ({
  productos,
  categorias,
  onSeleccionarProducto,
  cargando
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const coincideCategoria = categoriaFiltro === null || 
        (typeof p.id_categoria === 'object' ? p.id_categoria.id : p.id_categoria) === categoriaFiltro;
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, busqueda, categoriaFiltro]);

  if (cargando) {
    return <div className="p-4 text-center">Cargando productos...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded text-sm"
        />
      </div>

      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setCategoriaFiltro(null)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
              categoriaFiltro === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaFiltro(cat.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
                categoriaFiltro === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {cat.categoria}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {productosFiltrados.map(producto => (
          <button
            key={producto.id}
            onClick={() => onSeleccionarProducto(producto)}
            className="p-2 rounded border hover:border-blue-500 hover:bg-blue-50 transition text-left"
            disabled={!producto.disponibilidad}
          >
            {producto.imagen && (
              <img
                src={import.meta.env.VITE_API_URL +producto.imagen}
                alt={producto.nombre}
                className="w-full h-20 object-cover rounded mb-1"
              />
            )}
            <div className="text-xs font-bold line-clamp-2">{producto.nombre}</div>
            <div className="text-xs text-green-600 font-bold">${producto.precio.toFixed(2)}</div>
            {!producto.disponibilidad && (
              <div className="text-xs text-red-500">No disponible</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductosSection;
