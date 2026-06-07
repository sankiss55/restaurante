import { useState, useCallback } from 'react';

interface FiltrosState {
  [key: string]: string | number | boolean | null;
}

interface UseFiltrosResult {
  filtros: FiltrosState;
  actualizarFiltro: (nombre: string, valor: any) => void;
  limpiarFiltros: () => void;
  aplicarFiltro: (callback: (filtros: FiltrosState) => void) => void;
}

const useFiltros = (filtrosIniciales: FiltrosState = {}): UseFiltrosResult => {
  const [filtros, setFiltros] = useState<FiltrosState>(filtrosIniciales);

  const actualizarFiltro = useCallback((nombre: string, valor: any) => {
    setFiltros((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros(filtrosIniciales);
  }, [filtrosIniciales]);

  const aplicarFiltro = useCallback(
    (callback: (filtros: FiltrosState) => void) => {
      callback(filtros);
    },
    [filtros]
  );

  return {
    filtros,
    actualizarFiltro,
    limpiarFiltros,
    aplicarFiltro,
  };
};

export default useFiltros;
