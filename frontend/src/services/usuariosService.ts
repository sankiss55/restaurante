import api from './api';

export interface CreateUserData {
  nombre: string;
  correo: string;
  password: string;
  id_tipo: number;
}

export interface UsuarioResponse {
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

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Crear un nuevo usuario
 */
export const createUser = async (userData: CreateUserData): Promise<ServiceResponse<UsuarioResponse>> => {
  try {
    const response = await api.post('/usuarios/CreateUser', userData);
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al crear usuario';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Login de usuario
 */
export const login = async (correo: string, password: string): Promise<ServiceResponse<{ CodeJWT: string }>> => {
  try {
    const response = await api.post('/usuarios/login', { correo, password });
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al iniciar sesión';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Obtener lista de usuarios (si existe endpoint)
 */
export const obtenerUsuarios = async (): Promise<ServiceResponse<UsuarioResponse[]>> => {
  try {
    const response = await api.get('/usuarios');
    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al obtener usuarios';
    return {
      success: false,
      error: errorMsg,
    };
  }
};


