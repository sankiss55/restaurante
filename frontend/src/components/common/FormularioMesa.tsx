import React from 'react';
import InputForm from './InputForm';

export interface FormularioMesaData {
  numero_mesa: string;
  activo: boolean;
}

interface FormularioMesaProps {
  valores: FormularioMesaData;
  onChange: (campo: keyof FormularioMesaData, valor: any) => void;
  errores: { [key: string]: string };
  esEdicion?: boolean;
}

const FormularioMesa: React.FC<FormularioMesaProps> = ({
  valores,
  onChange,
  errores,
  esEdicion = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Número de Mesa */}
      <InputForm
        label="Número de Mesa"
        name="numero_mesa"
        type="number"
        placeholder="Ej: 1"
        value={valores.numero_mesa}
        onChange={(e) => onChange('numero_mesa', e.target.value)}
        error={errores.numero_mesa}
        required
        disabled={esEdicion}
        min="1"
      />

      {/* Estado Activo */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <input
          type="checkbox"
          id="activo"
          checked={valores.activo}
          onChange={(e) => onChange('activo', e.target.checked)}
          className="w-4 h-4 text-[#4F6A50] border-gray-300 rounded cursor-pointer focus:ring-[#4F6A50]"
        />
        <label htmlFor="activo" className="text-sm font-medium text-gray-700 cursor-pointer">
          Mesa activa / disponible
        </label>
      </div>

      {/* Información */}
      <p className="text-xs text-gray-500 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
        ℹ️ El número de mesa {esEdicion ? 'no puede' : 'puede'} ser modificado. Solo puedes cambiar el estado de disponibilidad.
      </p>
    </div>
  );
};

export default FormularioMesa;
