import React from 'react';

const MesasPanel: React.FC = () => {


  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="relative w-full sm:w-[400px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscador de mesas por ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#719575]/50 focus:border-[#719575] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4F6A50] hover:bg-[#3D553F] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-[#4F6A50]/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva Mesa
          </button>
          
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E9EFE9] hover:bg-[#d8e3d8] text-[#4F6A50] text-sm font-semibold rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0H4.5m4.5 12h9.75M10.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0H4.5m6-6h9.75M16.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0H4.5" />
            </svg>
            Filtrar
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-[#E9EFE9]/50 border-b border-gray-100">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-2">ID DE MESA</div>
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">ESTADO</div>
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">CAPACIDAD</div>
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[80px] text-right">ACCIONES</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {/* Mesas */}
        </div>

        {/* Footer info/Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[13px] text-gray-500">Mostrando 4 de 24 mesas registradas</p>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#4F6A50] hover:bg-[#3D553F] text-white rounded-lg transition-colors font-bold text-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-bold text-sm">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-bold text-sm">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MesasPanel;