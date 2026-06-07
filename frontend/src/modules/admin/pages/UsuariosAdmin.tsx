import React, { useState, useEffect } from 'react';
import { FiUsers, FiCheckCircle, FiSettings } from 'react-icons/fi';
import Tabla from '../../../components/common/Tabla';
import TarjetaEstadistica from '../../../components/common/TarjetaEstadistica';
import InputBusqueda from '../../../components/common/InputBusqueda';
import Boton from '../../../components/common/Boton';
import Paginacion from '../../../components/common/Paginacion';
import ModalForm from '../../../components/common/ModalForm';
import FormularioUsuario from '../../../components/common/FormularioUsuario';
import type { FormularioUsuarioData } from '../../../components/common/FormularioUsuario';
import Toast from '../../../components/floating/Toast';
import ConfirmDialog from '../../../components/floating/ConfirmDialog';
import { useToast } from '../../../hooks/useToast';
import * as usuariosService from '../../../services/usuariosService';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  id_tipo: TipoUsuario;
  activo: boolean;
}

interface TipoUsuario {
  id: number;
  tipo: string;
}

const UsuariosAdmin: React.FC = () => {
  const { toasts, cerrar, exitoso, error: mostrarError } = useToast();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<number | null>(null);

  const [cargando, setCargando] = useState(false);
  const [cargandoModal, setCargandoModal] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);
  const [cargandoTipos, setCargandoTipos] = useState(false);

  const [formData, setFormData] = useState<FormularioUsuarioData>({
    nombre: '',
    correo: '',
    password: '',
    id_tipo: '',
    activo: true,
  });

  const [editFormData, setEditFormData] = useState<FormularioUsuarioData>({
    nombre: '',
    correo: '',
    password: '',
    id_tipo: '',
    activo: true,
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    cargarUsuarios();
    cargarTiposUsuario();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const response = await usuariosService.obtenerUsuarios();
      if (response.success && response.data) {
        setUsuarios(response.data);
      } else {
        mostrarError(response.error || 'Error al cargar usuarios');
      }
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  const cargarTiposUsuario = async () => {
    try {
      setCargandoTipos(true);
      setTiposUsuario([
        { id: 1, tipo: 'Admin' },
        { id: 2, tipo: 'Mesero' },
        { id: 3, tipo: 'Cocinero' },
      ]);
    } catch (err: any) {
      mostrarError(err.message || 'Error al cargar tipos de usuario');
    } finally {
      setCargandoTipos(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);
  const datosVisibles = usuariosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleAbrirModal = () => {
    setFormData({
      nombre: '',
      correo: '',
      password: '',
      id_tipo: '',
      activo: true,
    });
    setErrores({});
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setFormData({
      nombre: '',
      correo: '',
      password: '',
      id_tipo: '',
      activo: true,
    });
    setErrores({});
  };

  const handleAbrirEditarModal = (usuario: Usuario) => {
    setEditFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '',
      id_tipo: usuario.id_tipo.toString(),
      activo: usuario.activo,
    });
    setErrores({});
    setModalEditarOpen(true);
  };

  const handleCerrarEditarModal = () => {
    setModalEditarOpen(false);
    setEditFormData({
      nombre: '',
      correo: '',
      password: '',
      id_tipo: '',
      activo: true,
    });
    setErrores({});
  };

  const validarFormulario = (data: FormularioUsuarioData, esEdicion: boolean = false): boolean => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!data.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    } else if (data.nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!data.correo.trim()) {
      nuevosErrores.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
      nuevosErrores.correo = 'El correo no es válido';
    }

    if (!esEdicion) {
      if (!data.password) {
        nuevosErrores.password = 'La contraseña es requerida';
      } else if (data.password.length < 8) {
        nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (data.password.length > 25) {
        nuevosErrores.password = 'La contraseña no debe exceder 25 caracteres';
      }
    }

    if (!data.id_tipo) {
      nuevosErrores.id_tipo = 'Debes seleccionar un tipo de usuario';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (validarFormulario(formData, false)) {
      try {
        setCargandoModal(true);
        const response = await usuariosService.createUser({
          nombre: formData.nombre,
          correo: formData.correo,
          password: formData.password,
          id_tipo: parseInt(formData.id_tipo),
        });

        if (response.success) {
          await cargarUsuarios();
          exitoso('Usuario creado correctamente', 'Éxito');
          handleCerrarModal();
        } else {
          setErrores({ submit: response.error || 'Error al crear usuario' });
        }
      } catch (err: any) {
        setErrores({ submit: err.message || 'Error inesperado' });
      } finally {
        setCargandoModal(false);
      }
    }
  };

  const handleActualizarUsuario = async () => {
    if (validarFormulario(editFormData, true)) {
      try {
        setCargandoModal(true);
        exitoso('Usuario actualizado correctamente', 'Éxito');
        await cargarUsuarios();
        handleCerrarEditarModal();
      } catch (err: any) {
        setErrores({ submit: err.message || 'Error inesperado' });
      } finally {
        setCargandoModal(false);
      }
    }
  };

  const handleEliminar = (id: number) => {
    setUsuarioAEliminar(id);
    setConfirmDialogOpen(true);
  };

  const confirmarEliminar = async () => {
    if (usuarioAEliminar === null) return;

    try {
      setCargandoEliminar(true);
      await cargarUsuarios();
      exitoso('Usuario desactivado correctamente', 'Éxito');
      setConfirmDialogOpen(false);
      setUsuarioAEliminar(null);
    } catch (err: any) {
      mostrarError(err.message || 'Error inesperado');
    } finally {
      setCargandoEliminar(false);
    }
  };

  const usuariosActivos = usuarios.filter((u) => u.activo).length;
  const adminCount = usuarios.filter((u) => u.id_tipo?.id === 1).length;

  const columnas = [
    {
      key: 'nombre',
      etiqueta: 'Nombre',
      ancho: '1.2fr',
      render: (valor: string) => (
        <p className="font-semibold text-gray-900">{valor}</p>
      ),
    },
    {
      key: 'correo',
      etiqueta: 'Correo',
      ancho: '1.5fr',
      render: (valor: string) => (
        <p className="text-gray-600 text-sm">{valor}</p>
      ),
    },
    {
      key: 'id_tipo',
      etiqueta: 'Tipo de Usuario',
      ancho: '1fr',
      render: (valor: TipoUsuario) => {
        const tipos: { [key: number]: string } = {
          1: 'bg-purple-100 text-purple-700',
          2: 'bg-blue-100 text-blue-700',
          3: 'bg-orange-100 text-orange-700',
        };
        return (
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full  'bg-gray-100 text-gray-700'`}>
            {valor?.tipo}
          </span>
        );
      },
    },
    {
      key: 'activo',
      etiqueta: 'Estado',
      ancho: '0.8fr',
      render: (valor: boolean) => (
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
          valor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {valor ? 'Activo' : 'Inactivo'}
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Administra los usuarios del sistema y sus permisos.
          </p>
        </div>
        <Boton
          texto="Crear Usuario"
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
          etiqueta="Total Usuarios"
          valor={usuarios.length.toString()}
          icono={<FiUsers className="text-3xl" />}
        />
        <TarjetaEstadistica
          etiqueta="Usuarios Activos"
          valor={usuariosActivos.toString()}
          icono={<FiCheckCircle className="text-3xl" />}
        />
        <TarjetaEstadistica
          etiqueta="Administradores"
          valor={adminCount.toString()}
          icono={<FiSettings className="text-3xl" />}
        />
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <InputBusqueda
          placeholder="Buscar usuario por nombre o correo..."
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
            const usuario = usuarios.find((u) => u.id === id);
            if (usuario) handleAbrirEditarModal(usuario);
          },
          eliminar: (id) => handleEliminar(id),
        }}
      />

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        totalItems={usuariosFiltrados.length}
        itemsPorPagina={itemsPorPagina}
      />

      <ModalForm
        isOpen={modalOpen}
        titulo="Crear Nuevo Usuario"
        descripcion="Añade un nuevo usuario al sistema"
        confirmText="Crear Usuario"
        cancelText="Cancelar"
        onConfirm={handleGuardar}
        onCancel={handleCerrarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <FormularioUsuario
          valores={formData}
          onChange={(campo, valor) => setFormData({ ...formData, [campo]: valor })}
          errores={errores}
          tiposUsuario={tiposUsuario}
          cargandoTipos={cargandoTipos}
          esEdicion={false}
        />
      </ModalForm>

      <ModalForm
        isOpen={modalEditarOpen}
        titulo="Editar Usuario"
        descripcion="Modifica la información del usuario"
        confirmText="Guardar Cambios"
        cancelText="Cancelar"
        onConfirm={handleActualizarUsuario}
        onCancel={handleCerrarEditarModal}
        cargando={cargandoModal}
        error={errores.submit}
      >
        <FormularioUsuario
          valores={editFormData}
          onChange={(campo, valor) => setEditFormData({ ...editFormData, [campo]: valor })}
          errores={errores}
          tiposUsuario={tiposUsuario}
          cargandoTipos={cargandoTipos}
          esEdicion={true}
        />
      </ModalForm>

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        titulo="Desactivar Usuario"
        descripcion="¿Estás seguro de que deseas desactivar este usuario? No podrá acceder al sistema."
        confirmText="Sí, desactivar"
        cancelText="Cancelar"
        variant="peligro"
        onConfirm={confirmarEliminar}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setUsuarioAEliminar(null);
        }}
        cargando={cargandoEliminar}
      />
    </div>
  );
};

export default UsuariosAdmin;
