import React, { useState, useEffect } from 'react';
import SelectorMesas from '../components/SelectorMesas';
import ProductoMenu from '../components/ProductoMenu';
import ResumenPedido from '../components/ResumenPedido';
import ÓrdenesMesa from '../components/ÓrdenesMesa';
import {  obtenerMesas_mesero, type MesaResponse } from '../../../services/mesasService';
import { obtenerProductos } from '../../../services/productosService';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../context/AuthContext';
import { useWebSocket } from '../../../hooks/useWebSocket';
import type { ItemPedido } from '../types';
import { obtenerCategorias } from '../../../services/categoriasService';
import { crearOrdenCompleta } from '../../../services/ordenesService';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Mesa {
  id: string;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  ingredientes?: string;
  precio: number;
  imagen: string;
  disponibilidad: boolean;
  id_categoria: {
    id: number;
    categoria: string;
    descripcion?: string;
  };
  creation_date?: string;
  date_modification?: string;
}

interface Categoria {
  id: number;
  categoria: string;
  descripcion?: string;
}

const NuevoPedido: React.FC = () => {
  // ✅ Persistencia en localStorage entre recargas, tabs y sesiones
  const [mesaSeleccionada, setMesaSeleccionada] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('mesero_mesaEnAtencion');
    console.log('[NuevoPedido] 📍 Inicializando con mesa guardada:', saved);
    return saved || null;
  });
  const [mesaNumero, setMesaNumero] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('mesero_mesaNumero');
    return saved ? parseInt(saved) : null;
  });
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [itemsPedido, setItemsPedido] = useState<ItemPedido[]>([]);

  // API State
  const [mesas, setMesas] = useState<MesaResponse[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingMesas, setLoadingMesas] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [notaGlobal, setNotaGlobal] = useState('');
  const [productosBusqueda, setProductosBusqueda] = useState<Producto[]>([]);

  const { error, informacion } = useToast();
  const { user } = useAuth();
  useWebSocket('mesero');

  // Cargar mesas
  useEffect(() => {
    const cargarMesas = async () => {
      setLoadingMesas(true);
      try {
        const response = await obtenerMesas_mesero(user?.sub);
        console.log('[NuevoPedido] 📍 Mesas cargadas:', response);
        if (response.data) {
          setMesas(response.data);
        } else {
          error(response.error || 'Error al cargar mesas');
        }
      } catch (err) {
        error('Error inesperado al cargar mesas');
      } finally {
        setLoadingMesas(false);
      }
    };
    cargarMesas();
  }, [error]);

  // Escuchar evento de mesa liberada desde WebSocket
  useEffect(() => {
    const handleMesaLiberada = (event: Event) => {
      const mesaData = (event as CustomEvent).detail;
      const mesaLiberadaId = mesaData.data?.mesaId;
      console.log('[NuevoPedido] 🔓 Mesa liberada recibida:', { mesaLiberadaId, mesaSeleccionada });

      if (mesaSeleccionada === mesaLiberadaId?.toString()) {
        console.log('[NuevoPedido] 🔓 La mesa que atendíamos fue desocupada, limpiando...');
        setMesaSeleccionada(null);
        setMesaNumero(null);
        localStorage.removeItem('mesero_mesaEnAtencion');
        localStorage.removeItem('mesero_mesaNumero');
      }

      const recargarMesas = async () => {
        try {
          const response = await obtenerMesas_mesero(user?.sub||0);
          console.log(response);
          if (response.success && response.data) {
            setMesas(response.data);
            if (mesaSeleccionada !== mesaLiberadaId?.toString()) {
              informacion(`✨ Mesa ${mesaLiberadaId} disponible`);
            }
          }
        } catch (err) {
          console.error('Error recargando mesas:', err);
        }
      };
      recargarMesas();
    };

    window.addEventListener('mesa-liberada', handleMesaLiberada);
    return () => window.removeEventListener('mesa-liberada', handleMesaLiberada);
  }, [informacion, mesaSeleccionada]);

  // Cargar productos y categorías
  useEffect(() => {
    const cargarProductos = async () => {
      setLoadingProductos(true);
      try {
        const response = await obtenerProductos({ disponibilidad: true });
        const categoriasResponse = await obtenerCategorias();

        if (response.success && response.data) {
          setProductos(response.data as unknown as Producto[]);
          setProductosBusqueda(response.data as unknown as Producto[]);
          if (categoriasResponse.success && categoriasResponse.data) {
            setCategorias(categoriasResponse.data as Categoria[]);
          }
        } else {
          error(response.error || 'Error al cargar productos');
        }
      } catch (err) {
        error('Error inesperado al cargar productos');
      } finally {
        setLoadingProductos(false);
      }
    };
    cargarProductos();
  }, [error]);

  // Filtro de mesas: disponibles + la que estoy atendiendo
  const mesaEnAtencionId = mesaSeleccionada ? parseInt(mesaSeleccionada) : null;
  const mesasDisponibles = mesas.filter((mesa) => {
    const esDisponible = !mesa.atendida;
    const laAtiendeEstaPersona = mesa.id === mesaEnAtencionId;
    return esDisponible || laAtiendeEstaPersona;
  });

  const mesasFormato: Mesa[] = mesasDisponibles.map((mesa) => ({
    id: mesa.id.toString(),
    nombre: `Mesa ${mesa.numero_mesa}`,
  }));

  const productosFiltrados = productosBusqueda.filter((p) => {
    const categoriaId =
      typeof p.id_categoria === 'object' ? p.id_categoria.id : p.id_categoria;
    return categoriaActiva === null || categoriaId === categoriaActiva;
  });

  const BuscarProductos = (text: string) => {
    if (text.trim().length === 0) {
      setProductosBusqueda(productos);
    } else {
      setProductosBusqueda(
        productos.filter((p) => p.nombre.toLowerCase().includes(text.toLowerCase()))
      );
    }
  };

  const handleAgregarProducto = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return;

    const itemExistente = itemsPedido.find((item) => item.id_producto === productoId);
    if (itemExistente) {
      setItemsPedido(
        itemsPedido.map((item) =>
          item.id_producto === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setItemsPedido([
        ...itemsPedido,
        {
          id: Date.now(),
          id_producto: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precio: producto.precio,
        },
      ]);
    }
  };

  const handleSeleccionarMesa = (mesaId: string | null) => {
    console.log('[NuevoPedido] 📍 Mesa seleccionada:', mesaId);
    setMesaSeleccionada(mesaId);

    if (mesaId) {
      localStorage.setItem('mesero_mesaEnAtencion', mesaId);
      const mesaEncontrada = mesas.find((m) => m.id.toString() === mesaId);
      if (mesaEncontrada) {
        setMesaNumero(mesaEncontrada.numero_mesa);
        localStorage.setItem('mesero_mesaNumero', mesaEncontrada.numero_mesa.toString());
      }
    } else {
      setMesaNumero(null);
      localStorage.removeItem('mesero_mesaEnAtencion');
      localStorage.removeItem('mesero_mesaNumero');
    }
  };

  const handleEliminarItem = (id: number) => {
    setItemsPedido(itemsPedido.filter((item) => item.id !== id));
  };

  const handleModificarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      handleEliminarItem(id);
    } else {
      setItemsPedido(
        itemsPedido.map((item) =>
          item.id === id ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    }
  };

  const handleAgregarNota = (id: number, nota: string) => {
    setItemsPedido(
      itemsPedido.map((item) => (item.id === id ? { ...item, notas: nota } : item))
    );
  };

  const handleEnviarPedido = async () => {
    if (!mesaSeleccionada || itemsPedido.length === 0) {
      error('Selecciona una mesa y agrega productos');
      return;
    }
    if (!user?.sub) {
      error('No se pudo obtener la información del usuario');
      return;
    }

    try {
      setEnviando(true);
      const mesaEncontrada = mesas.find((m) => m.id.toString() === mesaSeleccionada);
      const mesaId = mesaEncontrada?.id;

      if (mesaId === undefined || mesaId === null) {
        error('No se encontró la mesa seleccionada');
        return;
      }

      const total = itemsPedido.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      const detalles = itemsPedido.map((item) => ({
        sub_total: item.precio * item.cantidad,
        producto_cantidad: item.cantidad,
        nota: item.nota || undefined,
        precio_unitario: item.precio,
        id_producto: item.id_producto,
        nombre_producto: item.nombre,
      }));

      const payload = {
        nota: notaGlobal || undefined,
        total,
        id_mesa: mesaId,
        usuario_atencion: user.sub,
        id_estado: 1,
        detalles,
      };

      const response = await crearOrdenCompleta(payload);

      if (response.success) {
        informacion('Pedido enviado a cocina exitosamente');
        setItemsPedido([]);
        setNotaGlobal('');
      } else {
        error(response.error || 'Error al enviar el pedido');
      }
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      error('Error inesperado al enviar el pedido');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex h-screen gap-4 p-4 bg-gray-100 overflow-hidden">

      {/* ── Panel Izquierdo: Mesas ── */}
      <div className="w-56 bg-white rounded-lg shadow p-4 flex flex-col overflow-hidden">
        <h2 className="text-lg font-bold mb-4 shrink-0">🪑 Mesas</h2>

        {loadingMesas ? (
          <div className="flex items-center justify-center flex-1">
            <div className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            <SelectorMesas
              mesas={mesasFormato}
              mesaSeleccionada={mesaSeleccionada}
              onSeleccionar={handleSeleccionarMesa}
            />
          </div>
        )}
      </div>

      {/* ── Panel Central: Productos ── */}
      <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col overflow-hidden">
        <h2 className="text-lg font-bold mb-4 shrink-0">🍽️ Productos</h2>

        {loadingProductos ? (
          <div className="flex items-center justify-center flex-1">
            <div className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-hidden flex-1">
            {/* Barra de búsqueda + filtros */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Buscar productos..."
                  onChange={(e) => BuscarProductos(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-[#4F6A50]/10"
                />
                <SlidersHorizontal className="absolute right-3 w-4 h-4 text-gray-400 cursor-pointer" />
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoriaActiva(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    categoriaActiva === null
                      ? 'bg-[#4F6A50] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                {categorias.map((ctg) => (
                  <button
                    key={ctg.id}
                    onClick={() => setCategoriaActiva(ctg.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                      categoriaActiva === ctg.id
                        ? 'bg-[#4F6A50] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {ctg.categoria}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de productos */}
            <div className="overflow-y-auto flex-1">
              {productosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay productos disponibles
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {productosFiltrados.map((producto) => (
                    <ProductoMenu
                      key={producto.id}
                      id={producto.id}
                      nombre={producto.nombre}
                      descripcion={producto.ingredientes || 'Sin descripción'}
                      precio={producto.precio}
                      onAgregar={handleAgregarProducto}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Panel Derecho: Resumen + Órdenes activas ── */}
      <div className="w-80 bg-white rounded-lg shadow p-4 flex flex-col overflow-hidden">
        <h2 className="text-lg font-bold mb-4 shrink-0">📝 Resumen</h2>

        <div className="overflow-y-auto flex-1 flex flex-col gap-4">
          <ResumenPedido
            items={itemsPedido}
            mesaSeleccionada={mesaSeleccionada}
            mesaNumero={mesaNumero}
            notaGlobal={notaGlobal}
            enviando={enviando}
            onEliminar={handleEliminarItem}
            onModificarCantidad={handleModificarCantidad}
            onAgregarNota={handleAgregarNota}
            onCambiarNotaGlobal={setNotaGlobal}
            onEnviar={handleEnviarPedido}
          />

          {/* Órdenes activas de la mesa seleccionada */}
          {mesaSeleccionada && (
            <ÓrdenesMesa mesaId={parseInt(mesaSeleccionada)} />
          )}
        </div>
      </div>

    </div>
  );
};

export default NuevoPedido;
