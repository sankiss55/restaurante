import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard } from 'lucide-react'
interface SidebarProps {
  moduleType?: 'admin' | 'mesero' | 'cocina';
}

const Sidebar: React.FC<SidebarProps> = ({ moduleType = 'admin' }) => {
    const { logout } = useAuth();
    const location = useLocation();
    
    const isActive = (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path);
    };
    
    return (
        <aside className="w-64 bg-white shadow-xl shadow-gray-200/50 flex flex-col z-10">
            

            {/* Navigation Links */}
            <nav className="flex-1 px-4 mt-4 space-y-1">
                {/* ADMIN MODULE */}
                {moduleType === 'admin' && (
                  <>
                  <Link 
                      to="/admin" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors group ${
                         location.pathname === '/admin'
                          ? 'bg-[#E9EFE9] text-[#2C3322]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <LayoutDashboard/>
                        Dashboard
                    </Link>
                    <Link 
                      to="/admin/mesas" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors group ${
                        isActive('/admin/mesas')
                          ? 'bg-[#E9EFE9] text-[#2C3322]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                        Mesas
                    </Link>
                    
                    <Link 
                      to="/admin/categorias" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                        isActive('/admin/categorias')
                          ? 'bg-[#E9EFE9] text-[#2C3322]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.304 4.828C13.228 4.038 12.5 2.5 12.5 2.5S11.772 4.038 10.696 4.828C9.654 5.592 8.25 5.5 8.25 5.5s1.5-1.5 1.5-3C9.75 1.228 11.25.5 11.25.5s1.5.728 1.5 2c0 1.5 1.5 3 1.5 3s-1.404.092-2.446-.672z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5h-9a2.25 2.25 0 00-2.25 2.25v6a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25z" />
                        </svg>
                        Categorías
                    </Link>

                    <Link 
                      to="/admin/productos" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                        isActive('/admin/productos')
                          ? 'bg-[#E9EFE9] text-[#2C3322]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        Productos
                    </Link>

                    <Link 
                      to="/admin/usuarios" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                        isActive('/admin/usuarios')
                          ? 'bg-[#E9EFE9] text-[#2C3322]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        Usuarios
                    </Link>
                  </>
                )}

                {/* MESERO MODULE */}
                {moduleType === 'mesero' && (
                  <>
                    <Link 
                      to="/mesero/nuevo-pedido" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                        isActive('/mesero/nuevo-pedido')
                          ? 'bg-[#E9EFE9] text-[#2C3322]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nuevo Pedido
                    </Link>
                  </>
                )}

                {/* COCINA MODULE */}
                {moduleType === 'cocina' && (
                  <>
                    <Link 
                      to="/cocina/pedidos-activos" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                        isActive('/cocina/pedidos-activos')
                          ? 'bg-[#E9EFE9] text-[#2C3322]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Pedidos Activos
                    </Link>
                  </>
                )}
            </nav>

            <div className="p-4 border-t border-gray-100 flex flex-col gap-1">
               
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-colors w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
