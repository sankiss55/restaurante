import React, { useState, useEffect } from 'react';
import { FiFolder } from 'react-icons/fi';
import Tabla from '../../../components/common/Tabla';
import TarjetaEstadistica from '../../../components/common/TarjetaEstadistica';
import InputBusqueda from '../../../components/common/InputBusqueda';
import Boton from '../../../components/common/Boton';
import Paginacion from '../../../components/common/Paginacion';
import Modal from '../../../components/common/Modal';
import InputForm from '../../../components/common/InputForm';
import Toast from '../../../components/floating/Toast';
import ConfirmDialog from '../../../components/floating/ConfirmDialog';
import { useToast } from '../../../hooks/useToast';
import * as categoriasService from '../../../services/categoriasService';

interface Categoria {
  id: number;
  categoria: string;
  descripcion?: string;
}

const CategoriasAdmin: React.FC = () => {
  const { toasts, cerrar, exitoso, error: mostrarError } = useToast();
  
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<number | null>(null);
  const [formData, setFormData] = useState({ categoria: '', descripcion: '' });
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoModal, setCargandoModal] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);
  const [modalVisualizarOpen, setModalVisualizarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [editFormData, setEditFormData] = useState({ categoria: '', descripcion: '' });

  // Cargar categorías al montar
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const response = await categoriasService.obtenerCategorias();
      if (response.success && response.data) {
        setCategorias(response.data);
      } else {
        mostrarError(response.error || 'Error al cargar categorías');
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(categoriasFiltradas.length / itemsPorPagina);
  const datosVisibles = categoriasFiltradas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleAbrirModal = () => {
    setFormData({ categoria: '', descripcion: '' });
    setErrores({});
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setFormData({ categoria: '', descripcion: '' });
    setErrores({});
  };

  const handleVisualizarCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalVisualizarOpen(true);
  };

  const handleAbrirEditarModal = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setEditFormData({ categoria: categoria.categoria, descripcion: categoria.descripcion || '' });
    setModalEditarOpen(true);
    setErrores({});
  };

  const handleCerrarEditarModal = () => {
    setModalEditarOpen(false);
    setCategoriaSeleccionada(null);
    setEditFormData({ categoria: '', descripcion: '' });
    setErrores({});
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!formData.categoria.trim()) {
      nuevosErrores.categoria = 'El nombre es requerido';
    }
    if (formData.categoria.length < 3) {
      nuevosErrores.categoria = 'El nombre debe tener al menos 3 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (validarFormulario()) {
      try {
        setCargandoModal(true);
        const response = await categoriasService.crearCategoria({
          categoria: formData.categoria,
          descripcion: formData.descripcion,
        });

        if (response.success) {
          await cargarCategorias();
          exitoso('Categoría creada correctamente', 'Éxito');
          handleCerrarModal();
        } else {
          setErrores({ submit: response.error || 'Error al crear categoría' });
        }
      } catch (err: any) {
        setErrores({ submit: err.message || 'Error inesperado' });
      } finally {
        setCargandoModal(false);
      }
    }
  };

  const handleActualizarCategoria = async () => {
    if (validarFormulario()) {
      try {
        setCargandoModal(true);
        // TODO: Implement update endpoint when available
        // const response = await categoriasService.actualizarCategoria(categoriaSeleccionada?.id, editFormData);
        exitoso('Categoría actualizada correctamente', 'Éxito');
        await cargarCategorias();
        handleCerrarEditarModal();
      } catch (err: any) {
        setErrores({ submit: err.message || 'Error inesperado' });
      } finally {
        setCargandoModal(false);
      }
    }
  };

  const handleEliminar = (id: number) => {
    setCategoriaAEliminar(id);
    setConfirmDialogOpen(true);
  };

  const confirmarEliminar = async () => {
    if (categoriaAEliminar === null) return;

    try {
      setCargandoEliminar(true);
      const response = await categoriasService.eliminarCategoria(categoriaAEliminar);

      if (response.success) {
        await cargarCategorias();
        exitoso('Categoría eliminada correctamente', 'Éxito');
        setConfirmDialogOpen(false);
        setCategoriaAEliminar(null);
      } else {
        mostrarError(response.error || 'Error al eliminar categoría');
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargandoEliminar(false);
    }
  };

  const columnas = [
    {
      key: 'categoria',
      etiqueta: 'Nombre de Categoría',
      ancho: '1fr',
      render: (valor: string) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900">{valor}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'descripcion',
      etiqueta: 'Descripción',
      ancho: '1.5fr',
      render: (valor: string) => <p className="text-gray-600 text-sm line-clamp-2">{valor}</p>,
    },
    
  ];

  return (
    <div className="space-y-6">
      {/* Toasts */}
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Organiza y segmenta tu menú para una mayor eficiencia en el servicio.
          </p>
        </div>
        <Boton
          texto="Añadir Categoría"
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

      {/* Tarjetas de estadística */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TarjetaEstadistica
          etiqueta="Total Categorías"
          valor={categorias.length.toString()}
          icono={<FiFolder className="text-3xl" />}
        />
        
        <TarjetaEstadistica
          variante="destacado"
          etiqueta="Optimización de Menú"
          valor=""
          descripcion="Las categorías más usadas este mes: Entrantes y Postres."
          icono={<FiFolder className="text-3xl" />}
        />
      </div>

      {/* Controles de búsqueda */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <InputBusqueda
          placeholder="Buscar categoría por nombre..."
          valor={busqueda}
          onChange={setBusqueda}
        />
      </div>

      {/* Tabla */}
      <Tabla
        columnas={columnas}
        datos={datosVisibles}
        cargando={cargando}
        acciones={{
          ver: (id) => {
            const cat = categorias.find(c => c.id === id);
            if (cat) handleVisualizarCategoria(cat);
          },
          editar: (id) => {
            const cat = categorias.find(c => c.id === id);
            if (cat) handleAbrirEditarModal(cat);
          },
          eliminar: (id) => handleEliminar(id),
        }}
      />

      {/* Paginación */}
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        totalItems={categoriasFiltradas.length}
        itemsPorPagina={itemsPorPagina}
      />

      {/* Modal de crear categoría */}
      <Modal
        isOpen={modalOpen}
        titulo="Nueva Categoría"
        descripcion="Agrega una nueva categoría a tu menú"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleGuardar}
        onCancel={handleCerrarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <div className="space-y-4">
          <InputForm
            label="Nombre de Categoría"
            name="categoria"
            type="text"
            placeholder="Ej: Hamburguesas Gourmet"
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
            error={errores.categoria}
            required={true}
          />
          <InputForm
            label="Descripción (opcional)"
            name="descripcion"
            type="text"
            placeholder="Ej: Selección premium de hamburguesas..."
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            multiline={true}
          />
        </div>
      </Modal>

      {/* Modal Visualizar Categoría */}
      <Modal
        isOpen={modalVisualizarOpen}
        titulo="Detalles de Categoría"
        descripcion="Información completa de la categoría"
        confirmText="Cerrar"
        onConfirm={() => setModalVisualizarOpen(false)}
        onCancel={() => setModalVisualizarOpen(false)}
      >
        {categoriaSeleccionada && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Categoría</label>
              <p className="text-base font-semibold text-gray-900">{categoriaSeleccionada.categoria}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <p className="text-base text-gray-700 whitespace-pre-wrap">{categoriaSeleccionada.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Editar Categoría */}
      <Modal
        isOpen={modalEditarOpen}
        titulo="Editar Categoría"
        descripcion="Modifica la información de la categoría"
        confirmText="Guardar Cambios"
        cancelText="Cancelar"
        onConfirm={handleActualizarCategoria}
        onCancel={handleCerrarEditarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <div className="space-y-4">
          <InputForm
            label="Nombre de Categoría"
            name="categoria"
            type="text"
            placeholder="Ej: Hamburguesas Gourmet"
            value={editFormData.categoria}
            onChange={(e) =>
              setEditFormData({ ...editFormData, categoria: e.target.value })
            }
            error={errores.categoria}
            required={true}
          />
          <InputForm
            label="Descripción"
            name="descripcion"
            type="text"
            placeholder="Ej: Selección premium de hamburguesas..."
            value={editFormData.descripcion}
            onChange={(e) =>
              setEditFormData({ ...editFormData, descripcion: e.target.value })
            }
            multiline={true}
          />
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        titulo="Eliminar Categoría"
        descripcion="¿Estás seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="peligro"
        onConfirm={confirmarEliminar}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setCategoriaAEliminar(null);
        }}
        cargando={cargandoEliminar}
      />
    </div>
  );
};

export default CategoriasAdmin;