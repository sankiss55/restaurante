import React from 'react';

interface ModalFormProps {
  isOpen: boolean;
  titulo: string;
  descripcion?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  cargando?: boolean;
  error?: string;
  variant?: 'default' | 'peligro';
}

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  titulo,
  descripcion,
  confirmText = 'Guardar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  children,
  cargando = false,
  error,
  variant = 'default',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 space-y-6 max-h-[90vh] overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
          {descripcion && <p className="text-sm text-gray-600 mt-1">{descripcion}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">{children}</div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            disabled={cargando}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={cargando}
            className={`flex-1 px-4 py-3 font-semibold rounded-xl text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              variant === 'peligro'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#4F6A50] hover:bg-[#3d5440]'
            }`}
          >
            {cargando && (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
