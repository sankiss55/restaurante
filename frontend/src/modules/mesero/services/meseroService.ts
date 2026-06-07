import Cookies from 'js-cookie';
import api from '../../../services/api';
import type { Mesa, Orden } from '../types';

export const meseroService = {
  async obtenerMesasAtendidas(idUsuario: number): Promise<Mesa[]> {
    const token = Cookies.get('auth_token');
    const res = await api.get(`/mesas/mis_mesas/${idUsuario}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data || [];
  },

  async obtenerMesasDisponibles(): Promise<Mesa[]> {
    const token = Cookies.get('auth_token');
    const res = await api.get('/mesas/disponibles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data || [];
  },

  async asignarMesa(idMesa: number, idUsuario: number): Promise<void> {
    const token = Cookies.get('auth_token');
    await api.patch(`/mesas/asignar/${idMesa}/${idUsuario}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async crearOrdenConDetalles(payload: any): Promise<Orden> {
    const token = Cookies.get('auth_token');
    const res = await api.post('/ordenes/crear_orden_completa', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
  },

  async marcarOrdenPagada(idOrden: number): Promise<void> {
    const token = Cookies.get('auth_token');
    await api.patch(`/ordenes/${idOrden}/marcar-pagado`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
