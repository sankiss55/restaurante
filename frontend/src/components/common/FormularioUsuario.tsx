import React from 'react';
import InputForm from './InputForm';

export interface FormularioUsuarioData {
  nombre: string;
  correo: string;
  password: string;
  id_tipo: string;
  activo: boolean;
}

interface TipoUsuario {
  id: number;
  tipo: string;
}

interface FormularioUsuarioProps {
  valores: FormularioUsuarioData;
  onChange: (campo: keyof FormularioUsuarioData, valor: any) => void;
  errores: { [key: string]: string };
  tiposUsuario: TipoUsuario[];
  cargandoTipos?: boolean;
  esEdicion?: boolean;
}

const FormularioUsuario: React.FC<FormularioUsuarioProps> = ({
  valores,
  onChange,
  errores,
  tiposUsuario,
  cargandoTipos = false,
  esEdicion = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Nombre */}
      <InputForm
        label="Nombre"
        name="nombre"
        type="text"
        placeholder="Ej: Juan Pérez"
        value={valores.nombre}
        onChange={(e) => onChange('nombre', e.target.value)}
        error={errores.nombre}
        required
      />

      {/* Correo */}
      <InputForm
        label="Correo Electrónico"
        name="correo"
        type="email"
        placeholder="Ej: juan@ejemplo.com"
        value={valores.correo}
        onChange={(e) => onChange('correo', e.target.value)}
        error={errores.correo}
        required
        disabled={esEdicion}
      />

      {/* Contraseña */}
      {!esEdicion && (
        <InputForm
          label="Contraseña"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={valores.password}
          onChange={(e) => onChange('password', e.target.value)}
          error={errores.password}
          required
        />
      )}

      {/* Tipo de Usuario */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Usuario <span className="text-red-600 ml-1">*</span>
        </label>
        <select
          value={valores.id_tipo}
          onChange={(e) => onChange('id_tipo', e.target.value)}
          disabled={cargandoTipos}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4F6A50] focus:ring-1 focus:ring-[#4F6A50] disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        >
          <option value="">Seleccionar tipo de usuario...</option>
          {tiposUsuario.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.tipo}
            </option>
          ))}
        </select>
        {errores.id_tipo && (
          <p className="text-sm text-red-600">{errores.id_tipo}</p>
        )}
      </div>

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
          Usuario activo
        </label>
      </div>
    </div>
  );
};

export default FormularioUsuario;
