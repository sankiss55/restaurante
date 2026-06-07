export interface Mesa {
  id: number;
  numero_mesa: number;
  atendida: boolean;
  activo: boolean;
  id_usuario?: number;
  usuario?: any;
}

export interface Producto {
  id: number;
  nombre: string;
  ingredientes?: string;
  precio: number;
  imagen: string;
  disponibilidad: boolean;
  id_categoria: {
    id: number;
    categoria: string;
    descripcion?: string;
  };
}

export interface Categoria {
  id: number;
  categoria: string;
  descripcion?: string;
}

export interface ItemPedido {
  id: number;
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio: number;
  nota?: string;
}

export interface DetalleOrden {
  id_producto: number;
  nombre_producto: string;
  precio_unitario: number;
  producto_cantidad: number;
  nota?: string;
}

export interface Orden {
  id: number;
  id_mesa: Mesa;
  id_estado: {
    id: number;
    estado: string;
  };
  total: number;
  nota?: string;
  created_at: string;
  usuario_atencion?: any;
  detalles?: DetalleOrden[];
}
