import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import './index.css';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import MeseroLayoutSimple from './layouts/MeseroLayoutSimple';
import CocinaLayoutSimple from './layouts/CocinaLayoutSimple';

// Pages
import DashboardHome from './pages/DashboardHome';

// Admin Pages
import CategoriasAdmin from './modules/admin/pages/CategoriasAdmin';
import ProductosAdmin from './modules/admin/pages/ProductosAdmin';
import UsuariosAdmin from './modules/admin/pages/UsuariosAdmin';
import MesasAdmin from './modules/admin/pages/MesasAdmin';

// Mesero Pages
import NuevoPedido from './modules/mesero/pages/NuevoPedido';

// Cocina Pages
import PedidosActivos from './modules/cocina/pages/PedidosActivos';

const ProtectedRoute = ({ children, requiredRol }: { children: React.ReactNode; requiredRol?: string }) => {
  const { isAuthenticated, loading, rol } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y no coincide, redirigir
  if (requiredRol && rol !== requiredRol) {
    const rutaMap: Record<string, string> = {
      admin: '/admin',
      cocinero: '/cocina',
      mesero: '/mesero'
    };
    const rutaDestino = rutaMap[rol || 'admin'] || '/admin';
    console.log(`Rol requerido: ${requiredRol}, Rol actual: ${rol}. Redirigiendo a ${rutaDestino}`);
    return <Navigate to={rutaDestino} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated, loading, rol } = useAuth();

  const rutaMap: Record<string, string> = {
    admin: '/admin',
    cocinero: '/cocina',
    mesero: '/mesero'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated 
            ? <Navigate to={rutaMap[rol || 'admin'] || '/admin'} replace />
            : <Login />
        }
      />
      
      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRol="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="mesas" element={<MesasAdmin />} />
        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
      </Route>

      {/* MESERO ROUTES */}
      <Route
        path="/mesero"
        element={
          <ProtectedRoute requiredRol="mesero">
            <MeseroLayoutSimple />
          </ProtectedRoute>
        }
      >
        <Route index element={<NuevoPedido />} />
        <Route path="nuevo-pedido" element={<NuevoPedido />} />
      </Route>

      {/* COCINA ROUTES */}
      <Route
        path="/cocina"
        element={
          <ProtectedRoute requiredRol="cocinero">
            <CocinaLayoutSimple />
          </ProtectedRoute>
        }
      >
        <Route index element={<PedidosActivos />} />
        <Route path="pedidos-activos" element={<PedidosActivos />} />
      </Route>
      
      <Route path="/" element={<Navigate to={isAuthenticated ? rutaMap[rol || 'admin'] || '/admin' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
