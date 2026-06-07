import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MeseroLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar moduleType="mesero" />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MeseroLayout;
