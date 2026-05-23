import { Body, Controller, Post, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { OrdenCreatePDO } from "src/dtos/orden";
import { OrdenServices } from "./orden.service";
import { ModelResponce } from "src/responces/ModelResponse";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";

@Controller("ordenes")
@ApiTags("Ordenes")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.CONFLICT, description: 'Conflicto: mesa, usuario o estado no existen', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor', type: ExceptionsResponse})
export class OrdenesController{
    constructor(private readonly OrdenesService:OrdenServices){}
    @Post("crear_orden")
    @ApiOperation({ summary: 'Crear una nueva orden', description: 'Crea una nueva orden en el sistema con los datos de la mesa, usuario que atiende, estado inicial y total de la orden.' })
    @ApiResponse({ status: 201, description: 'Orden creada exitosamente', type: ModelResponce })
    async CrearOrden(@Body() data:OrdenCreatePDO){
        return await this.OrdenesService.CrearOrden(data)
    }
}