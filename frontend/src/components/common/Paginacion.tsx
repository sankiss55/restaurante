import React from 'react';

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
  totalItems: number;
  itemsPorPagina: number;
}

const Paginacion: React.FC<PaginacionProps> = ({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
  totalItems,
  itemsPorPagina,
}) => {
  const itemosInicio = (paginaActual - 1) * itemsPorPagina + 1;
  const itemosFin = Math.min(paginaActual * itemsPorPagina, totalItems);

  const generarBotones = () => {
    const botones = [];
    const maxBotonesVisibles = 3;
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotonesVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxBotonesVisibles - 1);

    if (fin - inicio + 1 < maxBotonesVisibles) {
      inicio = Math.max(1, fin - maxBotonesVisibles + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      botones.push(i);
    }

    return botones;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
      <p className="text-[13px] text-gray-500">
        Mostrando {itemosInicio} a {itemosFin} de {totalItems} elementos
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {generarBotones().map((pagina) => (
          <button
            key={pagina}
            onClick={() => onCambiarPagina(pagina)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors font-bold text-sm ${
              paginaActual === pagina
                ? 'bg-[#4F6A50] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {pagina}
          </button>
        ))}

        <button
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5L15.75 12l-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Paginacion;
