import React, { useState, useEffect } from 'react';
import { FiTable, FiCheckCircle, FiUsers } from 'react-icons/fi';
import Tabla from '../../../components/common/Tabla';
import TarjetaEstadistica from '../../../components/common/TarjetaEstadistica';
import InputBusqueda from '../../../components/common/InputBusqueda';
import Boton from '../../../components/common/Boton';
import Paginacion from '../../../components/common/Paginacion';
import ModalForm from '../../../components/common/ModalForm';
import FormularioMesa, { type FormularioMesaData } from '../../../components/common/FormularioMesa';
import Toast from '../../../components/floating/Toast';
import ConfirmDialog from '../../../components/floating/ConfirmDialog';
import { useToast } from '../../../hooks/useToast';
import * as mesasService from '../../../services/mesasService';

interface Mesa {
  id: number;
  numero_mesa: number;
  atendida: boolean;
  activo: boolean;
}

const MesasAdmin: React.FC = () => {
  const { toasts, cerrar, exitoso, error: mostrarError } = useToast();

  // Estados principales
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [mesaAEliminar, setMesaAEliminar] = useState<number | null>(null);

  // Estados de carga
  const [cargando, setCargando] = useState(false);
  const [cargandoModal, setCargandoModal] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState<FormularioMesaData>({
    numero_mesa: '',
    activo: true,
  });

  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [editFormData, setEditFormData] = useState<FormularioMesaData>({
    numero_mesa: '',
    activo: true,
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  // Cargar datos al montar
  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    try {
      setCargando(true);
      const response = await mesasService.obtenerMesas();
      if (response.success && response.data) {
        setMesas(response.data);
      } else {
        mostrarError(response.error || 'Error al cargar mesas');
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  // Filtrado y paginación
  const mesasFiltradas = mesas.filter((mesa) =>
    mesa.numero_mesa.toString().includes(busqueda.toLowerCase())
  );

  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(mesasFiltradas.length / itemsPorPagina);
  const datosVisibles = mesasFiltradas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  // Handlers de modal
  const handleAbrirModal = () => {
    setFormData({
      numero_mesa: '',
      activo: true,
    });
    setErrores({});
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setFormData({
      numero_mesa: '',
      activo: true,
    });
    setErrores({});
  };

  const handleAbrirEditarModal = (mesa: Mesa) => {
    setMesaSeleccionada(mesa);
    setEditFormData({
      numero_mesa: mesa.numero_mesa.toString(),
      activo: mesa.activo,
    });
    setErrores({});
    setModalEditarOpen(true);
  };

  const handleCerrarEditarModal = () => {
    setModalEditarOpen(false);
    setMesaSeleccionada(null);
    setEditFormData({
      numero_mesa: '',
      activo: true,
    });
    setErrores({});
  };

  // Validación
  const validarFormulario = (data: FormularioMesaData): boolean => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!data.numero_mesa) {
      nuevosErrores.numero_mesa = 'El número de mesa es requerido';
    } else if (parseInt(data.numero_mesa) <= 0) {
      nuevosErrores.numero_mesa = 'El número debe ser mayor a 0';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar mesa
  const handleGuardar = async () => {
    if (validarFormulario(formData)) {
      try {
        setCargandoModal(true);
        const response = await mesasService.crearMesa({
          numero_de_mesa: parseInt(formData.numero_mesa),
        });

        if (response.success) {
          await cargarMesas();
          exitoso('Mesa creada correctamente', 'Éxito');
          handleCerrarModal();
        } else {
          setErrores({ submit: response.error || 'Error al crear mesa' });
        }
      } catch (err: any) {
        setErrores({ submit: err.message || 'Error inesperado' });
      } finally {
        setCargandoModal(false);
      }
    }
  };

  // Actualizar mesa
  const handleActualizarMesa = async () => {
    if (validarFormulario(editFormData)) {
      try {
        setCargandoModal(true);
        const response = await mesasService.actualizarMesa(
          mesaSeleccionada!.id,
          editFormData.activo
        );

        if (response.success) {
          await cargarMesas();
          exitoso('Mesa actualizada correctamente', 'Éxito');
          handleCerrarEditarModal();
        } else {
          setErrores({ submit: response.error || 'Error al actualizar mesa' });
        }
      } catch (err: any) {
        setErrores({ submit: err.message || 'Error inesperado' });
      } finally {
        setCargandoModal(false);
      }
    }
  };


  const confirmarEliminar = async () => {
    if (mesaAEliminar === null) return;

    try {
      setCargandoEliminar(true);
      const response = await mesasService.actualizarMesa(mesaAEliminar, false);

      if (response.success) {
        await cargarMesas();
        exitoso('Mesa desactivada correctamente', 'Éxito');
        setConfirmDialogOpen(false);
        setMesaAEliminar(null);
      } else {
        mostrarError(response.error || 'Error al desactivar mesa');
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargandoEliminar(false);
    }
  };

  // Estadísticas
  const totalActivas = mesas.filter((m) => m.activo).length;
  const totalAtendidas = mesas.filter((m) => m.atendida).length;

  // Columnas de tabla
  const columnas = [
    {
      key: 'numero_mesa',
      etiqueta: 'Número de Mesa',
      ancho: '1fr',
      render: (valor: number) => (
        <p className="font-bold text-lg text-gray-900">Mesa #{valor}</p>
      ),
    },
    {
      key: 'activo',
      etiqueta: 'Estado',
      ancho: '1fr',
      render: (valor: boolean) => (
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            valor
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {valor ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      key: 'atendida',
      etiqueta: 'Disponibilidad',
      ancho: '1fr',
      render: (valor: boolean) => (
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            !valor
              ? 'bg-blue-100 text-blue-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {!valor ? 'Disponible' : 'Siendo atendida'}
        </span>
      ),
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

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mesas</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Administra las mesas disponibles en tu restaurante.
          </p>
        </div>
        <Boton
          texto="Añadir Mesa"
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
          etiqueta="Total de Mesas"
          valor={mesas.length.toString()}
          icono={<FiTable className="text-3xl" />}
        />
        <TarjetaEstadistica
          etiqueta="Mesas Activas"
          valor={totalActivas.toString()}
          icono={<FiCheckCircle className="text-3xl" />}
        />
        <TarjetaEstadistica
          etiqueta="Siendo Atendidas"
          valor={totalAtendidas.toString()}
          icono={<FiUsers className="text-3xl" />}
        />
      </div>

      {/* Búsqueda */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <InputBusqueda
          placeholder="Buscar mesa por número..."
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
          editar: (id) => {
            const mesa = mesas.find((m) => m.id === id);
            if (mesa) handleAbrirEditarModal(mesa);
          },
        }}
      />

      {/* Paginación */}
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        totalItems={mesasFiltradas.length}
        itemsPorPagina={itemsPorPagina}
      />

      {/* Modal Crear Mesa */}
      <ModalForm
        isOpen={modalOpen}
        titulo="Nueva Mesa"
        descripcion="Añade una nueva mesa a tu restaurante"
        confirmText="Crear Mesa"
        cancelText="Cancelar"
        onConfirm={handleGuardar}
        onCancel={handleCerrarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <FormularioMesa
          valores={formData}
          onChange={(campo, valor) => setFormData({ ...formData, [campo]: valor })}
          errores={errores}
          esEdicion={false}
        />
      </ModalForm>

      {/* Modal Editar Mesa */}
      <ModalForm
        isOpen={modalEditarOpen}
        titulo="Editar Mesa"
        descripcion="Modifica el estado de la mesa"
        confirmText="Guardar Cambios"
        cancelText="Cancelar"
        onConfirm={handleActualizarMesa}
        onCancel={handleCerrarEditarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <FormularioMesa
          valores={editFormData}
          onChange={(campo, valor) => setEditFormData({ ...editFormData, [campo]: valor })}
          errores={errores}
          esEdicion={true}
        />
      </ModalForm>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        titulo="Desactivar Mesa"
        descripcion="¿Estás seguro de que deseas desactivar esta mesa? No estará disponible para reservas."
        confirmText="Sí, desactivar"
        cancelText="Cancelar"
        variant="peligro"
        onConfirm={confirmarEliminar}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setMesaAEliminar(null);
        }}
        cargando={cargandoEliminar}
      />
    </div>
  );
};

export default MesasAdmin;
