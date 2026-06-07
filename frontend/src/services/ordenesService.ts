import api from './api';

import Cookies from 'js-cookie';
export interface DetalleOrdenItem {
  sub_total: number;
  producto_cantidad: number;
  nota?: string;
  precio_unitario: number;
  id_producto: number;
  nombre_producto: string;
}

export interface OrdenConDetallesRequest {
  nota?: string;
  total: number;
  id_mesa: number;
  usuario_atencion: number;
  id_estado: number;
  detalles: DetalleOrdenItem[];
}

export interface OrdenResponse {
  id: number;
  nota?: string;
  total: number;
  created_at: string;
  updated_at: string;
  id_mesa: number;
  usuario_atencion: number;
  id_estado: number;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Crear una orden completa con detalles en una sola transacción
 */
export const crearOrdenCompleta = async (
  ordenData: OrdenConDetallesRequest
): Promise<ServiceResponse<OrdenResponse>> => {
  try {
    const response = await api.post('/ordenes/crear_orden_completa', ordenData);
    return {
      success: true,
      data: response.data?.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || error.message || 'Error al crear la orden';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Cancelar una orden completa (elimina orden y detalles)
 */
export const cancelarOrden = async (id: number): Promise<ServiceResponse<any>> => {
  try {
    const response = await api.delete(`/ordenes/cancelar/${id}`);
    return {
      success: true,
      data: response.data?.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || error.message || 'Error al cancelar la orden';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

/**
 * Eliminar un detalle específico de una orden
 */
export const eliminarDetalleOrden = async (id: number): Promise<ServiceResponse<any>> => {
  try {
    const response = await api.delete(`/ordenes/detalles/${id}`);
    return {
      success: true,
      data: response.data?.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || error.message || 'Error al eliminar el detalle';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

export  const CambiarOrdenPagada= async (id_orden:number)=>{
  try{
    const tokent=Cookies.get('auth_token');
    const response = await api.patch(`/ordenes/${id_orden}/marcar-pagado`, 
  { id_estado: 5 },
  {
    headers: {
      Authorization: `Bearer ${tokent}`,
    },
  }
);
console.log(response.data)
  }catch(error:any){
    console.log('Error:', error.response?.data);
const errorMsg =
      error.response?.data?.message || error.message || 'Error al cancelar la orden';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
