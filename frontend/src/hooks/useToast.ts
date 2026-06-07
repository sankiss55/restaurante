import { useState, useCallback } from 'react';
import type { ToastVariante } from '../components/floating/Toast';

export interface ToastConfig {
  titulo?: string;
  mensaje: string;
  variante: ToastVariante;
  autoCerrar?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

interface ActiveToast extends ToastConfig {
  id: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const mostrar = useCallback((config: ToastConfig) => {
    const id = Date.now().toString();
    const toastConfig: ActiveToast = {
      ...config,
      id,
      autoCerrar: config.autoCerrar ?? 5000,
    };

    setToasts((prev) => [...prev, toastConfig]);

    return () => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };
  }, []);

  const exitoso = useCallback((mensaje: string, titulo?: string) => {
    mostrar({
      titulo: titulo || 'Éxito',
      mensaje,
      variante: 'exito',
    });
  }, [mostrar]);

  const error = useCallback((mensaje: string, titulo?: string) => {
    mostrar({
      titulo: titulo || 'Error',
      mensaje,
      variante: 'error',
    });
  }, [mostrar]);

  const advertencia = useCallback((mensaje: string, titulo?: string) => {
    mostrar({
      titulo: titulo || 'Advertencia',
      mensaje,
      variante: 'advertencia',
    });
  }, [mostrar]);

  const informacion = useCallback((mensaje: string, titulo?: string) => {
    mostrar({
      titulo: titulo || 'Información',
      mensaje,
      variante: 'informacion',
    });
  }, [mostrar]);

  const cerrar = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    mostrar,
    exitoso,
    error,
    advertencia,
    informacion,
    cerrar,
  };
};
