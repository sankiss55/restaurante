import { Body, Controller, Delete, Param, Post, HttpStatus, Patch, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { OrdenCreatePDO, OrdenConDetallesDTO, CambiarEstadoOrdenDTO } from "src/dtos/orden";
import { OrdenServices } from "./orden.service";
import { ModelResponce } from "src/responces/ModelResponse";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";
import { ValidateJWTGuards } from "src/guards/validateJWT.guards";
import type { Request } from "express";
import { Roles, RolesList } from "src/decorators/role.decorator";
@Controller("ordenes")
@ApiTags("Ordenes")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.CONFLICT, description: 'Conflicto: mesa, usuario o estado no existen', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor', type: ExceptionsResponse})
export class OrdenesController{
    constructor(private readonly OrdenesService:OrdenServices){}
    @Post("crear_orden")
    
    @Roles(RolesList.ADMIN)
    @ApiOperation({ summary: 'Crear una nueva orden', description: 'Crea una nueva orden en el sistema con los datos de la mesa, usuario que atiende, estado inicial y total de la orden.' })
    @ApiResponse({ status: 201, description: 'Orden creada exitosamente', type: ModelResponce })
    async CrearOrden(@Body() data:OrdenCreatePDO){
        return await this.OrdenesService.CrearOrden(data)
    }
    @Post("crear_orden_completa")
    @Roles(RolesList.MESERO)
    @ApiOperation({ summary: 'Crear una orden completa con detalles', description: 'Crea una orden completa junto con todos sus detalles en una sola transacción. Incluye notas por producto y nota global de la orden.' })
    @ApiResponse({ status: 201, description: 'Orden completa creada exitosamente', type: ModelResponce })
    @ApiResponse({ status: 400, description: 'Error de validación en los datos enviados', type: ExceptionsResponse })
    @ApiResponse({ status: 404, description: 'Mesa, usuario o estado no existen', type: ExceptionsResponse })
    @ApiResponse({ status: 409, description: 'Conflicto: mesa desactivada o sin detalles', type: ExceptionsResponse })
    async CrearOrdenCompleta(@Body() data: OrdenConDetallesDTO){
        return await this.OrdenesService.CrearOrdenConDetalles(data)
    }

    @Delete("cancelar/:id")
    @Roles(RolesList.ADMIN)
    @ApiOperation({ summary: 'Cancelar una orden completa', description: 'Cancela una orden existente, elimina todos sus detalles y desocupa la mesa.' })
    @ApiResponse({ status: 200, description: 'Orden cancelada exitosamente', type: ModelResponce })
    @ApiResponse({ status: 404, description: 'Orden no encontrada', type: ExceptionsResponse })
    @ApiResponse({ status: 500, description: 'Error interno del servidor', type: ExceptionsResponse })
    async CancelarOrden(@Param('id') id: number){
        return await this.OrdenesService.CancelarOrden(id)
    }

    @Delete("detalles/:id")
    @Roles(RolesList.ADMIN)
    @ApiOperation({ summary: 'Eliminar un detalle de una orden', description: 'Elimina un producto específico (detalle) de una orden existente.' })
    @ApiResponse({ status: 200, description: 'Detalle eliminado exitosamente', type: ModelResponce })
    @ApiResponse({ status: 404, description: 'Detalle de orden no encontrado', type: ExceptionsResponse })
    @ApiResponse({ status: 500, description: 'Error interno del servidor', type: ExceptionsResponse })
    async EliminarDetalleOrden(@Param('id') id: number){
        return await this.OrdenesService.EliminarDetalleOrden(id)
    }

    @Patch(":id/estado")
    @Roles(RolesList.COCINERO)
    @UseGuards(ValidateJWTGuards)
    @ApiOperation({ summary: 'Cambiar estado de una orden', description: 'Cambia el estado de una orden. Solo cocineros pueden cambiar Pendiente→Preparando o Preparando→Listo. Solo meseros pueden cambiar Listo→Pagado.' })
    @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente', type: ModelResponce })
    @ApiResponse({ status: 404, description: 'Orden no encontrada', type: ExceptionsResponse })
    @ApiResponse({ status: 409, description: 'Transición de estado inválida', type: ExceptionsResponse })
    async CambiarEstadoOrden(@Param('id') id: number, @Body() data: CambiarEstadoOrdenDTO, @Req() req: Request){
        const user = req['user'];
        const rol = user?.rol;
        return await this.OrdenesService.CambiarEstadoOrden(id, data.id_estado, rol)
    }

    @Post("listar/estados")
    @ApiOperation({ summary: 'Obtener órdenes por estados', description: 'Obtiene todas las órdenes con los estados especificados. Usado por Cocina y Mesero para cargar órdenes iniciales.' })
    @ApiResponse({ status: 200, description: 'Órdenes obtenidas exitosamente', type: ModelResponce })
    async GetOrdenesPorEstados(@Body() data: {estados: number[]}){
        return await this.OrdenesService.GetOrdenesPorEstados(data.estados);
    }

    @Patch(":id/marcar-pagado")
    @UseGuards(ValidateJWTGuards)
    @Roles(RolesList.MESERO)
    @ApiOperation({ summary: 'Marcar orden como pagada', description: 'Marca una orden como pagada. Solo meseros pueden usar este endpoint. Libera la mesa si es la última orden sin pagar.' })
    @ApiResponse({ status: 200, description: 'Orden marcada como pagada', type: ModelResponce })
    @ApiResponse({ status: 404, description: 'Orden no encontrada', type: ExceptionsResponse })
    @ApiResponse({ status: 409, description: 'Orden no está en estado Listo', type: ExceptionsResponse })
    async MarcarPagado(@Param('id') id: number, @Req() req: Request){
        const user = req['user'];
        const rol = user?.rol;
        return await this.OrdenesService.MarcarOrdenPagada(id, rol);
    }
}