import React, { useEffect, useState } from 'react';
import { GetInfoOrdenes, GetInfoProductos, GetInfoUsuarios } from '../services/dashboardService';
import {
  TrendingUp, ShoppingBag, Users, ChefHat,
  LayoutGrid, Clock, Trophy
} from 'lucide-react';

// ── Tipos ──────────────────────────────────────────────────────────────────
interface Orden {
  id: number;
  nota: string;
  total: number;
  created_at: string;
  updated_at: string;
}

interface ProductoVendido {
  Producto: string;
  TotalVendida: string;
}

interface InfoOrdenes {
  GananciasTotales: number;
  AllOrdenes: Orden[];
  NumeroTotalDeOrdenes: number;
  OrdenesPorMes: { mes: string; cantidad_ordenes: string; total_mes: number }[];
}

interface InfoProductos {
  CantidadDeProductos: number;
  Productos: ProductoVendido[];
  CantProductDiponibles: any[];
  CantProductNoDiponibles: any[];
}

interface InfoUsuarios {
  CantAdmin: number;
  CantMesero: number;
  CantCocinero: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

const pct = (val: number, total: number) =>
  total === 0 ? 0 : Math.round((val / total) * 100);

// ── Componente principal ───────────────────────────────────────────────────
const DashboardHome: React.FC = () => {
  const [ordenes, setOrdenes] = useState<InfoOrdenes | null>(null);
  const [productos, setProductos] = useState<InfoProductos | null>(null);
  const [usuarios, setUsuarios] = useState<InfoUsuarios | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resOrdenes, resProductos, resUsuarios] = await Promise.all([
          GetInfoOrdenes(),
          GetInfoProductos(),
          GetInfoUsuarios(),
        ]);
        setOrdenes(resOrdenes.data);
        setProductos(resProductos.data);
        setUsuarios(resUsuarios.data);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 border-4 border-[#4F6A50] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxVendido = Math.max(
    ...(productos?.Productos.map((p) => parseInt(p.TotalVendida)) ?? [1])
  );

  const totalUsuarios =
    (usuarios?.CantAdmin ?? 0) +
    (usuarios?.CantMesero ?? 0) +
    (usuarios?.CantCocinero ?? 0);

  const disponibles = productos?.CantProductDiponibles.length ?? 0;
  const noDisponibles = productos?.CantProductNoDiponibles.length ?? 0;

  return (
    <div
      className="space-y-6 p-6 min-h-screen bg-[#F7F8F5]"
      style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Encabezado */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#4F6A50] uppercase mb-1">
            Panel de control
          </p>
          <h1
            className="text-4xl font-extrabold text-[#1C2519] tracking-tight leading-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            Dashboard
          </h1>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })}
        </span>
      </div>

      {/* ── Tarjetas principales ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Ganancias totales"
          value={fmt(ordenes?.GananciasTotales ?? 0)}
          icon={<TrendingUp size={20} />}
          bg="bg-[#4F6A50]"
          textColor="text-white"
          subColor="text-emerald-100"
          iconBg="bg-white/20"
        />
        <StatCard
          label="Total de órdenes"
          value={String(ordenes?.NumeroTotalDeOrdenes ?? 0)}
          icon={<ShoppingBag size={20} />}
          bg="bg-white border border-gray-200"
          textColor="text-[#1C2519]"
          subColor="text-gray-400"
          iconBg="bg-[#F0F4EF]"
          iconColor="text-[#4F6A50]"
        />
        <StatCard
          label="Productos"
          value={String(productos?.CantidadDeProductos ?? 0)}
          icon={<LayoutGrid size={20} />}
          bg="bg-white border border-gray-200"
          textColor="text-[#1C2519]"
          subColor="text-gray-400"
          iconBg="bg-[#F0F4EF]"
          iconColor="text-[#4F6A50]"
        />
        <StatCard
          label="Usuarios"
          value={String(totalUsuarios)}
          icon={<Users size={20} />}
          bg="bg-white border border-gray-200"
          textColor="text-[#1C2519]"
          subColor="text-gray-400"
          iconBg="bg-[#F0F4EF]"
          iconColor="text-[#4F6A50]"
        />
      </div>

      {/* ── Fila media ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Productos más vendidos */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-[#F0F4EF] rounded-lg text-[#4F6A50]">
              <Trophy size={16} />
            </div>
            <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
              Productos más vendidos
            </h2>
          </div>
          <div className="space-y-4">
            {[...(productos?.Productos ?? [])]
              .sort((a, b) => parseInt(b.TotalVendida) - parseInt(a.TotalVendida))
              .map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: i === 0 ? '#4F6A50' : '#F0F4EF',
                          color: i === 0 ? 'white' : '#6B7264',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-semibold text-gray-700">{p.Producto}</span>
                    </div>
                    <span className="text-[#4F6A50] font-bold">{p.TotalVendida} uds.</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct(parseInt(p.TotalVendida), maxVendido)}%`,
                        background: i === 0 ? '#4F6A50' : '#A8C5A0',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex flex-col gap-4">
          {/* Usuarios por rol */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-[#F0F4EF] rounded-lg text-[#4F6A50]">
                <Users size={16} />
              </div>
              <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Equipo</h2>
            </div>
            <div className="space-y-3">
              <RolRow icon={<Users size={14} />} label="Administradores" count={usuarios?.CantAdmin ?? 0} color="bg-[#4F6A50]" />
              <RolRow icon={<ShoppingBag size={14} />} label="Meseros" count={usuarios?.CantMesero ?? 0} color="bg-blue-400" />
              <RolRow icon={<ChefHat size={14} />} label="Cocineros" count={usuarios?.CantCocinero ?? 0} color="bg-orange-400" />
            </div>
          </div>

          {/* Disponibilidad productos */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-[#F0F4EF] rounded-lg text-[#4F6A50]">
                <LayoutGrid size={16} />
              </div>
              <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Inventario</h2>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl bg-[#F0F4EF] p-3 text-center">
                <p className="text-2xl font-extrabold text-[#4F6A50]">{disponibles}</p>
                <p className="text-xs text-[#6B7264] mt-0.5 font-medium">Disponibles</p>
              </div>
              <div className="flex-1 rounded-xl bg-red-50 p-3 text-center">
                <p className="text-2xl font-extrabold text-red-500">{noDisponibles}</p>
                <p className="text-xs text-red-400 mt-0.5 font-medium">No disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tablas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Órdenes por mes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-[#F0F4EF] rounded-lg text-[#4F6A50]">
              <TrendingUp size={16} />
            </div>
            <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Resumen mensual</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mes</th>
                <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Órdenes</th>
                <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {ordenes?.OrdenesPorMes.map((m, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-[#F7F8F5] transition-colors">
                  <td className="py-3 font-semibold text-gray-700">{m.mes.trim()}</td>
                  <td className="py-3 text-gray-500">{m.cantidad_ordenes}</td>
                  <td className="py-3 font-bold text-[#4F6A50]">{fmt(m.total_mes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Últimas órdenes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-[#F0F4EF] rounded-lg text-[#4F6A50]">
              <Clock size={16} />
            </div>
            <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Últimas órdenes</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {[...(ordenes?.AllOrdenes ?? [])]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 7)
                .map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-[#F7F8F5] transition-colors">
                    <td className="py-3">
                      <span className="font-bold text-[#4F6A50]">#{o.id}</span>
                    </td>
                    <td className="py-3 font-semibold text-gray-700">{fmt(o.total)}</td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(o.created_at).toLocaleString('es-MX', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Sub-componentes ────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
  textColor: string;
  subColor: string;
  iconBg: string;
  iconColor?: string;
}> = ({ label, value, icon, bg, textColor, subColor, iconBg, iconColor = 'text-white' }) => (
  <div className={`rounded-2xl p-5 ${bg}`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <p className={`text-xs font-semibold uppercase tracking-widest ${subColor}`}>{label}</p>
    <p className={`text-3xl font-extrabold mt-1 ${textColor}`} style={{ letterSpacing: '-0.02em' }}>
      {value}
    </p>
  </div>
);

const RolRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}> = ({ icon, label, count, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-gray-600">
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-800">{count}</span>
  </div>
);

export default DashboardHome;