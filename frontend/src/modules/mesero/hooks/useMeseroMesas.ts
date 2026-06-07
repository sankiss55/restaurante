import { useState, useEffect } from 'react';
import { meseroService } from '../services/meseroService';
import type { Mesa } from '../types';

export const useMeseroMesas = (idUsuario: number) => {
  const [mesasAtendidas, setMesasAtendidas] = useState<Mesa[]>([]);
  const [mesasDisponibles, setMesasDisponibles] = useState<Mesa[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    try {
      setCargando(true);
      setError(null);
      const [atendidas, disponibles] = await Promise.all([
        meseroService.obtenerMesasAtendidas(idUsuario),
        meseroService.obtenerMesasDisponibles()
      ]);
      setMesasAtendidas(atendidas);
      setMesasDisponibles(disponibles);
    } catch (err: any) {
      setError(err.message || 'Error al cargar mesas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [idUsuario]);

  return { mesasAtendidas, mesasDisponibles, cargando, error, recargar: cargar };
};
