import React, { useEffect } from 'react';

export type ToastVariante = 'exito' | 'error' | 'advertencia' | 'informacion';

interface ToastProps {
  titulo?: string;
  mensaje: string;
  variante: ToastVariante;
  onClose?: () => void;
  autoCerrar?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

const Toast: React.FC<ToastProps> = ({
  titulo,
  mensaje,
  variante,
  onClose,
  autoCerrar = 5000,
  position = 'top-right',
}) => {
  useEffect(() => {
    if (autoCerrar) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCerrar);
      return () => clearTimeout(timer);
    }
  }, [autoCerrar, onClose]);

  const colores = {
    exito: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titulo: 'text-green-900',
      mensaje: 'text-green-700',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      titulo: 'text-red-900',
      mensaje: 'text-red-700',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    advertencia: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      titulo: 'text-yellow-900',
      mensaje: 'text-yellow-700',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    informacion: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titulo: 'text-blue-900',
      mensaje: 'text-blue-700',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
  };

  const posiciones = {
    'top-right': 'top-6 right-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  const iconos = {
    exito: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    advertencia: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
      </svg>
    ),
    informacion: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const estilos = colores[variante];

  return (
    <div
      className={`fixed ${posiciones[position]} animate-in slide-in-from-top-2 fade-in z-50 transition-all duration-300`}
    >
      <div
        className={`${estilos.bg} ${estilos.border} border rounded-lg p-4 shadow-lg max-w-sm pointer-events-auto`}
      >
        <div className="flex items-start gap-3">
          <div className={`${estilos.iconBg} ${estilos.icon} rounded-full p-2 flex-shrink-0 mt-0.5`}>
            {iconos[variante]}
          </div>
          <div className="flex-1 min-w-0">
            {titulo && <h3 className={`${estilos.titulo} font-semibold text-sm mb-1`}>{titulo}</h3>}
            <p className={`${estilos.mensaje} text-sm leading-relaxed`}>{mensaje}</p>
          </div>
          <button
            onClick={onClose}
            className={`${estilos.icon} hover:opacity-70 flex-shrink-0 ml-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
