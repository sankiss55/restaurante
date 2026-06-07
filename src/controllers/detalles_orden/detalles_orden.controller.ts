import { Body, Controller, Post, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DetallesOrdenesCreateDTO } from "src/dtos/detalles_ordenes";
import { DetallesOrdenesService } from "./detalles_orden.services";
import { ModelResponce } from "src/responces/ModelResponse";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";

@Controller("detalles_ordenes")
@ApiTags("Detalles de Ordenes")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.NOT_FOUND, description: 'La orden o el producto no existen', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor', type: ExceptionsResponse})
export class DetallesOrdenesController{
    constructor(private readonly DetallesOrdenesService:DetallesOrdenesService){}
    @Post("crear_detalle")
    @ApiOperation({ summary: 'Crear un nuevo detalle de orden', description: 'Agrega un detalle (línea de producto) a una orden existente con la cantidad, precio unitario, subtotal y notas especiales.' })
    @ApiResponse({ status: 201, description: 'Detalle de orden creado exitosamente', type: ModelResponce })
    async CrearDetalles(@Body() dataCreate:DetallesOrdenesCreateDTO):Promise<ModelResponce>{
        return await this.DetallesOrdenesService.CrearDetalle(dataCreate);
    }
}