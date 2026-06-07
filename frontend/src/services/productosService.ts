import api from './api';

export interface ProductoData {
  nombre: string;
  ingredientes?: string;
  precio: number;
  imagen: string;
  disponibilidad: boolean;
  id_categoria: number;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  ingredientes?: string;
  precio: number;
  id_categoria: number;
  imagen: string;
  disponibilidad: boolean;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Crear un nuevo producto
 */
export const crearProducto = async (productoData: ProductoData | FormData): Promise<ServiceResponse<ProductoResponse>> => {
  try {
    const response = await api.post('/productos/crear_producto', productoData, {
      headers: {
        'Content-Type': productoData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al crear producto';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Obtener/buscar productos con filtros opcionales
 */
export const obtenerProductos = async (filtros?: {
  nombre?: string;
  id_categoria?: number;
  disponibilidad?: boolean;
  precio?: number;
}): Promise<ServiceResponse<ProductoResponse[]>> => {
  try {
    const response = await api.get('/productos/buscar', { params: filtros });
    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al obtener productos';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Actualizar un producto
 */
export const actualizarProducto = async (id: number, productoData: Partial<ProductoData> | FormData): Promise<ServiceResponse<ProductoResponse>> => {
  try {
    const response = await api.patch(`/productos/modificar/${id}`, productoData, {
      headers: {
        'Content-Type': productoData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return { success: true, data: response.data?.data };
  } catch (error: any) {
     console.log('❌ Status:', error.response?.status);
  console.log('❌ Mensaje del server:', error.response?.data);  
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Cambiar disponibilidad de un producto
 */
export const cambiarDisponibilidad = async (id: number, disponibilidad: boolean): Promise<ServiceResponse<ProductoResponse>> => {
  try {
    const response = await api.patch(`/productos/cambiar_disponibilidad/${id}`, {
      disponibilidad,
    });
    return {
      success: true,
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Error al cambiar disponibilidad';
    return {
      success: false,
      error: errorMsg,
    };
  }
};
