import React from 'react';
import InputForm from './InputForm';
import InputFile from './InputFile';

export interface FormularioProductoData {
  nombre: string;
  ingredientes: string;
  precio: string;
  imagen: string;
  disponibilidad: boolean;
  id_categoria: id_categoria;
}
interface id_categoria{
  id?:number,
  categoria?:string,
  descripcion?:number
}
interface Categoria {
  id: number;
  categoria: string;
}

interface FormularioProductoProps {
  valores: FormularioProductoData;
  onChange: (campo: keyof FormularioProductoData, valor: any) => void;
  onImagenChange: (rutaRelativa: string, file: File) => void;
  errores: { [key: string]: string };
  categorias: Categoria[];
  cargandoCategorias?: boolean;
}

const FormularioProducto: React.FC<FormularioProductoProps> = ({
  valores,
  onChange,
  onImagenChange,
  errores,
  categorias,
  cargandoCategorias = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Nombre */}
      <InputForm
        label="Nombre del Producto"
        name="nombre"
        type="text"
        placeholder="Ej: Pizza Margherita"
        value={valores.nombre}
        onChange={(e) => onChange('nombre', e.target.value)}
        error={errores.nombre}
        required
      />

      {/* Precio */}
      <InputForm
        label="Precio"
        name="precio"
        type="number"
        placeholder="Ej: 25.99"
        value={valores.precio}
        onChange={(e) => onChange('precio', e.target.value)}
        error={errores.precio}
        required
      />

      {/* Ingredientes */}
      <InputForm
        label="Ingredientes (opcional)"
        name="ingredientes"
        type="text"
        placeholder="Ej: Tomate, queso, jamón"
        value={valores.ingredientes}
        onChange={(e) => onChange('ingredientes', e.target.value)}
        error={errores.ingredientes}
        multiline={true}
      />

      {/* Categoría */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Categoría <span className="text-red-600 ml-1">*</span>
        </label>
        <select
          value={valores.id_categoria.id}
          onChange={(e) => onChange('id_categoria', e.target.value)}
          disabled={cargandoCategorias}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4F6A50] focus:ring-1 focus:ring-[#4F6A50] disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoria}
            </option>
          ))}
        </select>
        {errores.id_categoria && (
          <p className="text-sm text-red-600">{errores.id_categoria}</p>
        )}
      </div>

      {/* Imagen */}
      <InputFile
        label="Imagen del Producto"
        name="imagen"
        onChange={onImagenChange}
        error={errores.imagen}
        required
        preview={valores.imagen && !valores.imagen.startsWith('/') ? undefined : undefined}
      />

      {/* Disponibilidad */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <input
          type="checkbox"
          id="disponibilidad"
          checked={valores.disponibilidad}
          onChange={(e) => onChange('disponibilidad', e.target.checked)}
          className="w-4 h-4 text-[#4F6A50] border-gray-300 rounded cursor-pointer focus:ring-[#4F6A50]"
        />
        <label htmlFor="disponibilidad" className="text-sm font-medium text-gray-700 cursor-pointer">
          Producto disponible
        </label>
      </div>
    </div>
  );
};

export default FormularioProducto;
