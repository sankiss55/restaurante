import { useState } from 'react';

interface UsePaginacionResult {
  paginaActual: number;
  setPaginaActual: (pagina: number) => void;
  irAPagina: (pagina: number) => void;
  proximaPagina: () => void;
  paginaAnterior: () => void;
}

const usePaginacion = (paginaInicial: number = 1): UsePaginacionResult => {
  const [paginaActual, setPaginaActual] = useState(paginaInicial);

  const irAPagina = (pagina: number) => {
    setPaginaActual(Math.max(1, pagina));
  };

  const proximaPagina = () => {
    setPaginaActual((prev) => prev + 1);
  };

  const paginaAnterior = () => {
    setPaginaActual((prev) => Math.max(1, prev - 1));
  };

  return {
    paginaActual,
    setPaginaActual,
    irAPagina,
    proximaPagina,
    paginaAnterior,
  };
};

export default usePaginacion;
