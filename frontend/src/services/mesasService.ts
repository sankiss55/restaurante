import api from './api';
import Cookies from 'js-cookie';
export interface MesaData {
  numero_de_mesa: number;
}

export interface MesaResponse {
  id: number;
  numero_mesa: number;
  atendida: boolean;
  activo: boolean;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Crear una nueva mesa
 */
export const crearMesa = async (mesaData: MesaData): Promise<ServiceResponse<MesaResponse>> => {
  try {
    const response = await api.post('/mesas/crearMesas', mesaData);
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al crear mesa';
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Obtener mesas con filtro opcional
 */
export const obtenerMesas_mesero = async (idUsuario: number): Promise<ServiceResponse<MesaResponse[]>>=> {
    const token = Cookies.get('auth_token');
    const res = await api.get(`/mesas/mis_mesas/${idUsuario}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data || [];
  }
export const obtenerMesas = async (filtro?: 'activado' | 'desactivado'): Promise<ServiceResponse<MesaResponse[]>> => {
  try {
    const params = filtro ? { filtro } : {};
    const response = await api.get('/mesas/traer_mesas', { params });
    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al obtener mesas';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Cambiar estado activo/inactivo de una mesa
 */
export const actualizarMesa = async (id: number, _activo: boolean): Promise<ServiceResponse<MesaResponse>> => {
  try {
    const response = await api.patch(`/mesas/modificar_estado/${id}`);
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al actualizar mesa';
    return {
      success: false,
      error: errorMsg,
    };
  }
};
