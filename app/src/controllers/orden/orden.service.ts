import { ConflictException, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrdenCreatePDO, OrdenConDetallesDTO, CambiarEstadoOrdenDTO } from "src/dtos/orden";
import { OrdenEntitie } from "src/entities/orden.entitie";
import { Repository, Not } from "typeorm";
import { MesasService } from "../mesas/mesas.services";
import { EstadoOrdenEntitie } from "src/entities/estado_orden.entitie";
import { UsuariosServices } from "../usuarios/usuarios.service";
import { ModelResponce } from "src/responces/ModelResponse";
import { DetallesOrdenEntitie } from "src/entities/detalles_orden.entitie";
import { MesasEntitie } from "src/entities/mesas.entitie";
import { OrdenesGateway } from 'src/gateways/ordenes.gateway';
import { Inject, forwardRef } from '@nestjs/common';
@Injectable()
export class OrdenServices{
    constructor(
        @InjectRepository(OrdenEntitie) private readonly OrdenBD: Repository<OrdenEntitie>,
        @InjectRepository(DetallesOrdenEntitie) private readonly DetallesOrdenBD: Repository<DetallesOrdenEntitie>,
        @InjectRepository(EstadoOrdenEntitie) private readonly EstadosOrden: Repository<EstadoOrdenEntitie>,
        private readonly MesasService: MesasService,
        private readonly UsuariosService: UsuariosServices,
        @Inject(forwardRef(() => OrdenesGateway))
private readonly gateway: OrdenesGateway
    ) {}
    async BuscarOrdenById(id:number){
        return await this.OrdenBD.findBy({
            id:id
        });
    }
    async CrearOrden({nota, total, id_mesa, usuario_atencion, id_estado}: OrdenCreatePDO): Promise<ModelResponce> {
        const mesa = await this.MesasService.BuscarMesaById(id_mesa);
        if (!mesa || mesa.length === 0) {
            throw new NotFoundException("La mesa no existe");
        }

        if (!mesa[0].activo) {
            throw new ConflictException("La mesa está desactivada");
        }

        const usuario = await this.UsuariosService.BuscarUsuarioById(usuario_atencion);
        if (!usuario || usuario.length === 0) {
            throw new NotFoundException("El usuario no existe");
        }

        const date = new Date();
        return this.OrdenBD.manager.transaction("SERIALIZABLE", async (transaction) => {
            const estado = await transaction.findOne(EstadoOrdenEntitie, { where: { id: id_estado } });
            if (!estado) {
                throw new NotFoundException("El estado no existe");
            }

            const nuevaOrden = new OrdenEntitie();
            nuevaOrden.nota = nota || '';
            nuevaOrden.total = total;
            nuevaOrden.created_at = date;
            nuevaOrden.updated_at = date;
            nuevaOrden.id_mesa = { id: id_mesa } as any;
            nuevaOrden.usuario_atencion = { id: usuario_atencion } as any;
            nuevaOrden.id_estado = estado;

            await transaction.save(OrdenEntitie, nuevaOrden);

            return {
                status: 'success',
                message: 'La orden se ha creado exitosamente',
                data: null
            };
        });
    }

    async CrearOrdenConDetalles(data: OrdenConDetallesDTO): Promise<ModelResponce> {
        const { id_mesa, usuario_atencion, detalles, nota, total, id_estado } = data;

        const mesa = await this.MesasService.BuscarMesaById(id_mesa);
        if (!mesa || mesa.length === 0) {
            throw new NotFoundException("La mesa no existe");
        }

        if (!mesa[0].activo) {
            throw new ConflictException("La mesa está desactivada");
        }

        if (!detalles || detalles.length === 0) {
            throw new BadRequestException("La orden debe tener al menos un producto");
        }

        const usuario = await this.UsuariosService.BuscarUsuarioById(usuario_atencion);
        if (!usuario || usuario.length === 0) {
            throw new NotFoundException("El usuario no existe");
        }

        return this.OrdenBD.manager.transaction("SERIALIZABLE", async (transaction) => {
            const estado = await transaction.findOne(EstadoOrdenEntitie, { where: { id: id_estado } });
            if (!estado) {
                throw new NotFoundException("El estado no existe");
            }
            
            const nuevaOrden = new OrdenEntitie();
            nuevaOrden.nota = nota || '';
            nuevaOrden.total = total;
            nuevaOrden.created_at = new Date();
            nuevaOrden.updated_at = new Date();
            nuevaOrden.id_mesa = { id: id_mesa } as any;
            nuevaOrden.usuario_atencion = { id: usuario_atencion } as any;
            nuevaOrden.id_estado = estado;

            const ordenGuardada = await transaction.save(OrdenEntitie, nuevaOrden);

            for (const detalle of detalles) {
                const nuevoDetalle = new DetallesOrdenEntitie();
                nuevoDetalle.sub_total = detalle.precio_unitario * detalle.producto_cantidad;
                nuevoDetalle.producto_cantidad = detalle.producto_cantidad;
                nuevoDetalle.precio_unitario = detalle.precio_unitario;
                nuevoDetalle.nombre_producto = detalle.nombre_producto;
                nuevoDetalle.nota = detalle.nota || '';
                nuevoDetalle.id_orden = { id: (ordenGuardada as any).id } as any;
                nuevoDetalle.id_producto = { id: detalle.id_producto } as any;

                await transaction.save(DetallesOrdenEntitie, nuevoDetalle);
            }

            const ordenConDetalles = await transaction.findOne(OrdenEntitie, {
                where: { id: (ordenGuardada as any).id },
                relations: ['detalles', 'id_mesa', 'id_estado', 'usuario_atencion']
            });
            transaction.update(MesasEntitie, {numero_mesa:id_mesa}, {
    atendida:true,
    id_usuario:usuario_atencion
});
this.gateway.emitirActualizacionOrden(ordenConDetalles);

            return {
                status: 'success',
                message: 'Orden creada exitosamente',
                data: ordenConDetalles
            };
        });
    }

    async CambiarEstadoOrden(id: number, nuevoEstado: number, rol: any): Promise<ModelResponce> {
        const orden = await this.OrdenBD.findOne({
            where: { id },
            relations: ['id_estado']
        });

        if (!orden) {
            throw new NotFoundException("Orden no encontrada");
        }

        const estadoActual = orden.id_estado.id;
        const rolValidado = typeof rol === 'number' ? rol.toString() : rol;

        if (rolValidado === '2' || rolValidado === 'cocinero') {
            if (estadoActual === 1 && nuevoEstado !== 2) {
                throw new ConflictException("El cocinero solo puede cambiar Pendiente→Preparando");
            }
            if (estadoActual === 2 && nuevoEstado !== 3) {
                throw new ConflictException("El cocinero solo puede cambiar Preparando→Listo");
            }
        } else if (rolValidado === '3' || rolValidado === 'mesero') {
            throw new ConflictException("El mesero no puede cambiar el estado de órdenes");
        } else {
            throw new BadRequestException("Rol no reconocido");
        }
        return this.OrdenBD.manager.transaction("SERIALIZABLE", async (transaction) => {
            const nuevoEstadoEntity = await transaction.findOne(EstadoOrdenEntitie, { where: { id: nuevoEstado } });
            
            if (!nuevoEstadoEntity) {
                throw new NotFoundException("El estado no existe");
            }

            await transaction.update(OrdenEntitie, id, {
                id_estado: { id: nuevoEstado },
                updated_at: new Date()
            });

            const ordenActualizada = await transaction.findOne(OrdenEntitie, {
                where: { id },
                relations: ['id_estado', 'detalles', 'id_mesa', 'usuario_atencion']
            });

this.gateway.emitirActualizacionOrden(ordenActualizada);
            return {
                status: 'success',
                message: 'Estado actualizado exitosamente',
                data: ordenActualizada
            };
        });
    }

    async GetOrdenesPorEstados(estados: number[]): Promise<ModelResponce> {
        const ordenes = await this.OrdenBD.find({
            where: estados.map(estado => ({ id_estado: { id: estado } })),
            relations: ['detalles', 'id_mesa', 'id_estado', 'usuario_atencion']
        });

        return {
            status: 'success',
            message: 'Órdenes obtenidas',
            data: ordenes
        };
    }

    async MarcarOrdenPagada(id: number, rol: any): Promise<ModelResponce> {
        const orden = await this.OrdenBD.findOne({
            where: { id },
            relations: ['id_estado', 'id_mesa', 'detalles']
        });

        if (!orden) {
            throw new NotFoundException("Orden no encontrada");
        }

        const rolValidado = typeof rol === 'number' ? rol.toString() : rol;
        if (rolValidado !== '3' && rolValidado.toLowerCase() !== 'mesero') {
            throw new BadRequestException("Solo los meseros pueden marcar órdenes como pagadas");
        }

        if (orden.id_estado.id !== 3) {
            throw new ConflictException("La orden no está en estado Listo");
        }
        return this.OrdenBD.manager.transaction("SERIALIZABLE", async (transaction) => {
            const idMesa = orden.id_mesa.id;
            
            const sinPagar = await transaction.count(OrdenEntitie, {
                where: { id_mesa: { id: idMesa }, id_estado: { id: Not(5) } }
            });

            await transaction.update(OrdenEntitie, id, {
                id_estado: { id: 5 } as any,
                updated_at: new Date()
            });

            if (sinPagar === 1) {
                await transaction.update(MesasEntitie, idMesa, {
                    atendida: false
                } as any);
                await transaction.update(MesasEntitie, {
                   id_usuario:idMesa 
                }, {
                    id_usuario: null
                } as any);
            }

            const ordenPagada = await transaction.findOne(OrdenEntitie, {
                where: { id },
                relations: ['id_estado', 'id_mesa', 'detalles', 'usuario_atencion']
            });

this.gateway.emitirActualizacionOrden(ordenPagada);
this.gateway.emitirMesaLiberada(idMesa);
            return {
                status: 'success',
                message: 'Orden marcada como pagada',
                data: ordenPagada
            };
        });
    }

    async CancelarOrden(id: number): Promise<ModelResponce> {
        const orden = await this.OrdenBD.findOne({
            where: { id },
            relations: ['id_mesa', 'detalles']
        });

        if (!orden) {
            throw new NotFoundException("Orden no encontrada");
        }

        return this.OrdenBD.manager.transaction("SERIALIZABLE", async (transaction) => {
            await transaction.delete(DetallesOrdenEntitie, { id_orden: { id } } as any);
            await transaction.update(OrdenEntitie, id, { id_estado: { id: 4 } as any });

            const sinPagar = await transaction.count(OrdenEntitie, {
                where: { id_mesa: { id: orden.id_mesa.id }, id_estado: { id: Not(5) } }
            });

            if (sinPagar === 0) {
                await transaction.update(MesasEntitie, orden.id_mesa.id, {
                    atendida: false
                } as any);
            }

            return {
                status: 'success',
                message: 'Orden cancelada',
                data: null
            };
        });
    }

    async EliminarDetalleOrden(id: number): Promise<ModelResponce> {
        const detalle = await this.DetallesOrdenBD.findOne({
            where: { id },
            relations: ['id_orden']
        });

        if (!detalle) {
            throw new NotFoundException("Detalle no encontrado");
        }

        return this.DetallesOrdenBD.manager.transaction("SERIALIZABLE", async (transaction) => {
            await transaction.delete(DetallesOrdenEntitie, id);

            const orden = await transaction.findOne(OrdenEntitie, {
                where: { id: detalle.id_orden.id },
                relations: ['detalles']
            });

            if (orden && (!orden.detalles || orden.detalles.length === 0)) {
                await this.CancelarOrden(detalle.id_orden.id);
            }

            return {
                status: 'success',
                message: 'Detalle eliminado',
                data: null
            };
        });
    }
}