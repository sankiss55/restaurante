import React from 'react';
import Toast from './Toast';

interface ToastItem {
  id: string;
  titulo?: string;
  mensaje: string;
  variante: 'exito' | 'error' | 'advertencia' | 'informacion';
  autoCerrar?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  // Agrupar toasts por posición
  const toastsByPosition = toasts.reduce(
    (acc, toast) => {
      const position = toast.position || 'top-right';
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    },
    {} as Record<string, ToastItem[]>
  );

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, items]) => (
        <div key={position} className="fixed z-50 pointer-events-none">
          {items.map((toast) => (
            <div key={toast.id} className="pointer-events-auto mb-3">
              <Toast
                titulo={toast.titulo}
                mensaje={toast.mensaje}
                variante={toast.variante}
                onClose={() => onClose(toast.id)}
                autoCerrar={toast.autoCerrar}
                position={position as 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default ToastContainer;
