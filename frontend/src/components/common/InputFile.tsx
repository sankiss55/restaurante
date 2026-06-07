import React, { useState } from 'react';

interface InputFileProps {
  label: string;
  name: string;
  accept?: string;
  error?: string;
  required?: boolean;
  onChange: (rutaRelativa: string, file: File) => void;
  preview?: string;
}

const InputFile: React.FC<InputFileProps> = ({
  label,
  name,
  accept = 'image/*',
  error,
  required = false,
  onChange,
  preview,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const [validacionError, setValidacionError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreviewUrl(null);
      setValidacionError('');
      return;
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setValidacionError('Solo se permiten imágenes en formato JPEG, PNG o WebP');
      setPreviewUrl(null);
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidacionError('La imagen no debe exceder 5MB');
      setPreviewUrl(null);
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);
      setValidacionError('');

      // Generar ruta relativa
      const timestamp = Date.now();
      const extension = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
      const rutaRelativa = `/images/productos/producto_${timestamp}.${extension}`;

      // Callback con ruta y archivo
      onChange(rutaRelativa, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div className="flex flex-col gap-3">
        {/* Input File */}
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          className="block w-full text-sm text-gray-700 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4F6A50] focus:ring-1 focus:ring-[#4F6A50]"
        />

        {/* Preview */}
        {previewUrl && (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setValidacionError('');
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Errores */}
        {validacionError && (
          <p className="text-sm text-red-600">{validacionError}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Hint */}
        <p className="text-xs text-gray-500">
          Formatos soportados: JPEG, PNG, WebP (máx. 5MB)
        </p>
      </div>
    </div>
  );
};

export default InputFile;
