import React, { useState, useEffect } from 'react';
import { FiPackage, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import Tabla from '../../../components/common/Tabla';
import TarjetaEstadistica from '../../../components/common/TarjetaEstadistica';
import InputBusqueda from '../../../components/common/InputBusqueda';
import Boton from '../../../components/common/Boton';
import Paginacion from '../../../components/common/Paginacion';
import ModalForm from '../../../components/common/ModalForm';
import FormularioProducto from '../../../components/common/FormularioProducto';
import type { FormularioProductoData } from '../../../components/common/FormularioProducto';
import Toast from '../../../components/floating/Toast';
import ConfirmDialog from '../../../components/floating/ConfirmDialog';
import { useToast } from '../../../hooks/useToast';
import * as productosService from '../../../services/productosService';
import * as categoriasService from '../../../services/categoriasService';

interface Producto {
  id: number;
  nombre: string;
  ingredientes?: string;
  precio: number;
  id_categoria: id_categoria;
  imagen: string;
  disponibilidad: boolean;
}
interface id_categoria{
  id?:number,
  categoria?:string,
  descripcion?:number
}
interface Categoria {
  id: number;
  categoria: string;
}

const ProductosAdmin: React.FC = () => {
  const { toasts, cerrar, exitoso, error: mostrarError } = useToast();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);

  const [cargando, setCargando] = useState(false);
  const [cargandoModal, setCargandoModal] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);

  const [formData, setFormData] = useState<FormularioProductoData>({
    nombre: '',
    ingredientes: '',
    precio: '',
    imagen: '',
    disponibilidad: true,
    id_categoria: {
      id:0,
      categoria:""
    },
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [editFormData, setEditFormData] = useState<FormularioProductoData>({
    nombre: '',
    ingredientes: '',
    precio: '',
    imagen: '',
    disponibilidad: true,
    id_categoria: {
      id:0,
      categoria:''
    },
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [archivoImagenEditar, setArchivoImagenEditar] = useState<File | null>(null);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const response = await productosService.obtenerProductos();
      if (response.success && response.data) {
        setProductos(response.data as Producto[]);
      } else {
        mostrarError(response.error || 'Error al cargar productos');
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      setCargandoCategorias(true);
      const response = await categoriasService.obtenerCategorias();
      if (response.success && response.data) {
        setCategorias(response.data);
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error al cargar categorías');
    } finally {
      setCargandoCategorias(false);
    }
  };

  const productosFiltrados = productos.filter(
    (prod) =>
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.ingredientes?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const datosVisibles = productosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleAbrirModal = () => {
    setFormData({
      nombre: '',
      ingredientes: '',
      precio: '',
      imagen: '',
      disponibilidad: true,
      id_categoria: {
        id:0,
        categoria:''
      },
    });
    setArchivoImagen(null);
    setErrores({});
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setFormData({
      nombre: '',
      ingredientes: '',
      precio: '',
      imagen: '',
      disponibilidad: true,
      id_categoria: {
        categoria:'',
        id:0
      },
    });
    setArchivoImagen(null);
    setErrores({});
  };

  const handleAbrirEditarModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setEditFormData({
      nombre: producto.nombre,
      ingredientes: producto.ingredientes || '',
      precio: producto.precio.toString(),
      imagen: producto.imagen,
      disponibilidad: producto.disponibilidad,
      id_categoria: producto.id_categoria,
    });
    setArchivoImagenEditar(null);
    setErrores({});
    setModalEditarOpen(true);
  };

  const handleCerrarEditarModal = () => {
    setModalEditarOpen(false);
    setProductoSeleccionado(null);
    setEditFormData({
      nombre: '',
      ingredientes: '',
      precio: '',
      imagen: '',
      disponibilidad: true,
      id_categoria: {},
    });
    setArchivoImagenEditar(null);
    setErrores({});
  };

  const validarFormulario = (data: FormularioProductoData): boolean => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!data.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    } else if (data.nombre.length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!data.precio) {
      nuevosErrores.precio = 'El precio es requerido';
    } else if (parseFloat(data.precio) <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0';
    }

    if (!data.id_categoria) {
      nuevosErrores.id_categoria = 'Debes seleccionar una categoría';
    }

    if (!data.imagen && !archivoImagen && !archivoImagenEditar) {
      nuevosErrores.imagen = 'La imagen es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
const handleGuardar = async () => {
  if (validarFormulario(formData)) {
    try {
      setCargandoModal(true);

      const data = new FormData();  // 👈
      data.append('nombre', formData.nombre);
      data.append('ingredientes', formData.ingredientes);
      data.append('precio', formData.precio);
      data.append('disponibilidad', formData.disponibilidad.toString());
      data.append('id_categoria', formData.id_categoria?.toString());
      if (archivoImagen) {
        data.append('imagen', archivoImagen);  // 👈 el archivo real
      }

      const response = await productosService.crearProducto(data);

      if (response.success) {
        await cargarProductos();
        exitoso('Producto creado correctamente', 'Éxito');
        handleCerrarModal();
      } else {
        setErrores({ submit: response.error || 'Error al crear producto' });
      }
    } catch (err: any) {
      setErrores({ submit: err.message || 'Error inesperado' });
    } finally {
      setCargandoModal(false);
    }
  }
};

 const handleActualizarProducto = async () => {
  if (validarFormulario(editFormData)) {
    try {
      setCargandoModal(true);

      const data = new FormData();
      data.append('nombre', editFormData.nombre);
      data.append('ingredientes', editFormData.ingredientes);
      data.append('precio', editFormData.precio);
      data.append('disponibilidad', editFormData.disponibilidad.toString());
      data.append('id_categoria', editFormData.id_categoria?.toString() );
      if (archivoImagenEditar) {
        data.append('imagen', archivoImagenEditar); 
      }

      const response = await productosService.actualizarProducto(productoSeleccionado!.id, data);
      
        if (response.success) {
          await cargarProductos();
          exitoso('Producto actualizado correctamente', 'Éxito');
          handleCerrarEditarModal();
        } else {
          setErrores({ submit: response.error || 'Error al actualizar producto' });
        }
      } catch (err: any) {
        setErrores({ submit: err.message || 'Error inesperado' });
      } finally {
        setCargandoModal(false);
      }
    }
  };

  const handleEliminar = (id: number) => {
    setProductoAEliminar(id);
    setConfirmDialogOpen(true);
  };

  const confirmarEliminar = async () => {
    if (productoAEliminar === null) return;

    try {
      setCargandoEliminar(true);
      const response = await productosService.cambiarDisponibilidad(
        productoAEliminar,
        false
      );

      if (response.success) {
        await cargarProductos();
        exitoso('Producto desactivado correctamente', 'Éxito');
        setConfirmDialogOpen(false);
        setProductoAEliminar(null);
      } else {
        mostrarError(response.error || 'Error al desactivar producto');
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargandoEliminar(false);
    }
  };


  const totalDisponibles = productos.filter((p) => p.disponibilidad).length;
  const precioPromedio = productos.length > 0
    ? (productos.reduce((sum, p) => sum + p.precio, 0) / productos.length).toFixed(2)
    : '0.00';

  const columnas = [
    {
      key: 'nombre',
      etiqueta: 'Nombre',
      ancho: '1.2fr',
      render: (valor: string, fila: Producto) => (
        <div className="flex items-center gap-2">
          <div>
            <p className="font-semibold text-gray-900">{valor}</p>
            {fila.ingredientes && (
              <p className="text-xs text-gray-500 line-clamp-1">{fila.ingredientes}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'precio',
      etiqueta: 'Precio',
      ancho: '0.8fr',
      render: (valor: number) => <p className="font-semibold text-gray-900">${valor.toFixed(2)}</p>,
    },
    {
      key: 'id_categoria',
      etiqueta: 'Categoría',
      ancho: '1fr',
      render: (valor:any) => {
        const categoria = categorias.find((c) => c.id === valor?.id);
        return (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {categoria?.categoria || 'N/A'}
          </span>
        );
      },
    },
    {
      key: 'disponibilidad',
      etiqueta: 'Disponibilidad',
      ancho: '1fr',
      render: (valor: boolean) => (
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            valor
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {valor ? 'Disponible' : 'No disponible'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          titulo={toast.titulo}
          mensaje={toast.mensaje}
          variante={toast.variante}
          onClose={() => cerrar(toast.id)}
          autoCerrar={toast.autoCerrar}
          position={toast.position}
        />
      ))}

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Administra el catálogo de productos disponibles en tu restaurante.
          </p>
        </div>
        <Boton
          texto="Añadir Producto"
          variante="primario"
          onClick={handleAbrirModal}
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TarjetaEstadistica
          etiqueta="Total Productos"
          valor={productos.length.toString()}
          icono={<FiPackage className="text-3xl" />}
        />
        <TarjetaEstadistica
          etiqueta="Productos Disponibles"
          valor={totalDisponibles.toString()}
          icono={<FiCheckCircle className="text-3xl" />}
        />
        <TarjetaEstadistica
          etiqueta="Precio Promedio"
          valor={`$${precioPromedio}`}
          icono={<FiDollarSign className="text-3xl" />}
        />
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <InputBusqueda
          placeholder="Buscar producto por nombre o ingredientes..."
          valor={busqueda}
          onChange={setBusqueda}
        />
      </div>

      <Tabla
        columnas={columnas}
        datos={datosVisibles}
        cargando={cargando}
        acciones={{
          editar: (id) => {
            const prod = productos.find((p) => p.id === id);
            if (prod) handleAbrirEditarModal(prod);
          },
          eliminar: (id) => handleEliminar(id),
        }}
      />

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        totalItems={productosFiltrados.length}
        itemsPorPagina={itemsPorPagina}
      />

      <ModalForm
        isOpen={modalOpen}
        titulo="Nuevo Producto"
        descripcion="Añade un nuevo producto al catálogo"
        confirmText="Crear Producto"
        cancelText="Cancelar"
        onConfirm={handleGuardar}
        onCancel={handleCerrarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <FormularioProducto
          valores={formData}
          onChange={(campo, valor) => setFormData({ ...formData, [campo]: valor })}
          onImagenChange={(rutaRelativa, file) => {
            setFormData({ ...formData, imagen: rutaRelativa });
            setArchivoImagen(file);
          }}
          errores={errores}
          categorias={categorias}
          cargandoCategorias={cargandoCategorias}
        />
      </ModalForm>

      <ModalForm
        isOpen={modalEditarOpen}
        titulo="Editar Producto"
        descripcion="Modifica la información del producto"
        confirmText="Guardar Cambios"
        cancelText="Cancelar"
        onConfirm={handleActualizarProducto}
        onCancel={handleCerrarEditarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <FormularioProducto
          valores={editFormData}
          onChange={(campo, valor) => setEditFormData({ ...editFormData, [campo]: valor })}
          onImagenChange={(rutaRelativa, file) => {
            setEditFormData({ ...editFormData, imagen: rutaRelativa });
            setArchivoImagenEditar(file);
          }}
          errores={errores}
          categorias={categorias}
          cargandoCategorias={cargandoCategorias}
        />
      </ModalForm>

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        titulo="Desactivar Producto"
        descripcion="¿Estás seguro de que deseas desactivar este producto? No será visible en el menú."
        confirmText="Sí, desactivar"
        cancelText="Cancelar"
        variant="peligro"
        onConfirm={confirmarEliminar}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setProductoAEliminar(null);
        }}
        cargando={cargandoEliminar}
      />
    </div>
  );
};

export default ProductosAdmin;
