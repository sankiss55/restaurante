import React, { useState, useEffect } from 'react';

type VarianteAlerta = 'exito' | 'error' | 'advertencia' | 'informacion';

interface AlertaProps {
  titulo: string;
  mensaje?: string;
  variante?: VarianteAlerta;
  onClose?: () => void;
  autoCerrar?: number; // en milisegundos
}

const Alerta: React.FC<AlertaProps> = ({
  titulo,
  mensaje,
  variante = 'informacion',
  onClose,
  autoCerrar,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoCerrar) {
      const timer = setTimeout(() => {
        handleCerrar();
      }, autoCerrar);
      return () => clearTimeout(timer);
    }
  }, [autoCerrar]);

  const handleCerrar = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const estilos: Record<VarianteAlerta, { bg: string; text: string; icon: string }> = {
    exito: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-900',
      icon: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-900',
      icon: 'text-red-600',
    },
    advertencia: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
    },
    informacion: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
    },
  };

  const estilo = estilos[variante];
  const iconoSvg = {
    exito: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`w-5 h-5 ${estilo.icon}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`w-5 h-5 ${estilo.icon}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    advertencia: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`w-5 h-5 ${estilo.icon}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    informacion: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`w-5 h-5 ${estilo.icon}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25.75m6-4.5h.008v.008h-.008V6.75m.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm6 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={`border rounded-lg p-4 flex gap-3 ${estilo.bg}`}
      role="alert"
    >
      <div className="flex-shrink-0">{iconoSvg[variante]}</div>
      <div className="flex-1">
        <h3 className={`font-bold ${estilo.text}`}>{titulo}</h3>
        {mensaje && <p className={`text-sm mt-1 ${estilo.text}`}>{mensaje}</p>}
      </div>
      <button
        onClick={handleCerrar}
        className={`flex-shrink-0 ${estilo.icon} hover:opacity-75 transition-opacity`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Alerta;
