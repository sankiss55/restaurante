import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  refetch?: boolean;
}

interface UseFetchResult<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useFetch = <T,>(
  url: string,
  options?: UseFetchOptions
): UseFetchResult<T> => {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const config: any = {
        method: options?.method || 'GET',
      };

      if (options?.body) {
        config.data = options.body;
      }

      const response = await api(url, config);
      setDatos(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos');
    } finally {
      setCargando(false);
    }
  }, [url, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { datos, cargando, error, refetch };
};

export default useFetch;
