import { Body, Controller, Post, Get, Patch, Param, Query, ParseIntPipe, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ProductosServces } from "./productos.services";
import { ProductosCreatePDO, ProductosFilterDTO, ProductosUpdateDTO } from "src/dtos/Productos";
import { ModelResponce } from "src/responces/ModelResponse";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";
import { Mode } from "fs";

@Controller("productos")
@ApiTags("Productos")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.CONFLICT, description: 'Conflicto: duplicado de nombre o categoría inválida', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Recurso no encontrado', type: ExceptionsResponse})
export class ProductosController{
    constructor(private readonly ProductosServices:ProductosServces){}

    @Post("crear_producto")
    @ApiOperation({ summary: 'Crear un nuevo producto', description: 'Crea un nuevo producto en el sistema con los datos proporcionados. El nombre debe ser único.' })
    @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: ModelResponce })
    async CrearProducto(@Body()data:ProductosCreatePDO):Promise<ModelResponce>{
        return await this.ProductosServices.CrearProducto(data);
    }

    @Get("buscar")
    @ApiOperation({ summary: 'Buscar productos con filtros opcionales', description: 'Busca productos en el sistema. Si no proporciona filtros, devuelve todos los productos. Los filtros son opcionales y se pueden combinar.' })
    @ApiResponse({ status: 200, description: 'Búsqueda completada exitosamente', type: ModelResponce })
    async BuscarProductos(@Query() filtro: ProductosFilterDTO): Promise<ModelResponce> {
        const productos = await this.ProductosServices.BuscarProductosByFiltro(filtro);
        return {
            status: 'success',
            data: productos,
            message: `Se encontraron ${productos.length} producto(s).`
        };
    }

    @Patch("modificar/:id")
    @ApiOperation({ summary: 'Actualizar un producto', description: 'Actualiza la información de un producto existente. Solo los campos proporcionados serán actualizados. La fecha de modificación se actualiza automáticamente.' })
    @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente', type: ModelResponce })
    async ActualizarProducto(
        @Param("id", ParseIntPipe) id: number,
        @Body() data: ProductosUpdateDTO
    ): Promise<ModelResponce> {
        return await this.ProductosServices.ActualizarProducto(id, data);
    }

    @Patch("cambiar_disponibilidad/:id")
    @ApiBody({
       schema:{
        example:{
            disponibilidad:true
        }
       }
    })
    async CambiarDisponibilidad(@Param("id", ParseIntPipe) id:number, @Body("disponibilidad") disponibilidad:boolean):Promise<ModelResponce>{
        return await this.ProductosServices.CambiarDisponibilidad(id,disponibilidad);
    }
}