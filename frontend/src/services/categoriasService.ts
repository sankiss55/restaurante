import api from './api';

export interface CategoriaData {
  categoria: string;
  descripcion?: string;
}

export interface CategoriaResponse {
  id: number;
  categoria: string;
  descripcion?: string;
  activo: boolean;
  productos?: number;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Crear una nueva categoría
 */
export const crearCategoria = async (categoriaData: CategoriaData): Promise<ServiceResponse<CategoriaResponse>> => {
  try {
    const response = await api.post('/categorias/crear_categoria', categoriaData);
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al crear categoría';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Obtener todas las categorías
 */
export const obtenerCategorias = async (): Promise<ServiceResponse<CategoriaResponse[]>> => {
  try {
    const response = await api.get('/categorias/all_categorias');
    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al obtener categorías';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Actualizar información de una categoría
 */
export const actualizarCategoria = async (id: number, categoriaData: CategoriaData): Promise<ServiceResponse<CategoriaResponse>> => {
  try {
    const response = await api.patch('/categorias/modificar_info', {
      id,
      ...categoriaData,
    });
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al actualizar categoría';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Eliminar una categoría
 */
export const eliminarCategoria = async (id: number): Promise<ServiceResponse<void>> => {
  try {
    await api.delete(`/categorias/eliminar_categoria/${id}`);
    return {
      success: true,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al eliminar categoría';
    return {
      success: false,
      error: errorMsg,
    };
  }
};
