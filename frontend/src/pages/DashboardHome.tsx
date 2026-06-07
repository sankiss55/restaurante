import React from 'react';
import MesasPanel from '../components/MesasPanel';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2C3322] tracking-tight">Administración de Mesas</h1>
        <p className="text-sm font-medium text-[#6B7264] mt-1">Gestiona la disponibilidad y organización de tu sala</p>
      </div>
      <MesasPanel />
    </div>
  );
};

export default DashboardHome;
