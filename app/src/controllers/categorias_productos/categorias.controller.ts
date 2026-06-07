import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Patch, Query, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoriasServices } from "./categorias.services";
import { CategoriasModificarPDO, CategoriasProductosDTO } from "src/dtos/categorias_productos";
import { ModelResponce } from "src/responces/ModelResponse";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";
import { Roles, RolesList } from "src/decorators/role.decorator";
@Controller("categorias")
@ApiTags("Categorias")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.CONFLICT, description: 'Conflicto: nombre duplicado o tiene productos asociados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.NOT_FOUND, description: 'La categoría no existe', type: ExceptionsResponse})
@Roles(RolesList.ADMIN)
export class CategoriasController{
    constructor(private readonly CategoriasServices:CategoriasServices){}
    @Post("crear_categoria")
    @ApiOperation({ summary: 'Crear una nueva categoría', description: 'Crea una nueva categoría de productos en el sistema. El nombre de la categoría debe ser único.' })
    @ApiResponse({ status: 201, description: 'Categoría creada exitosamente', type: ModelResponce })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 409, description: 'El nombre de la categoría ya existe' })
    CrearCategoria(@Body()data:CategoriasProductosDTO){
        return this.CategoriasServices.CrearCategoria(data);

    }
    @Delete("eliminar_categoria/:id")
    @ApiOperation({ summary: 'Eliminar una categoría', description: 'Elimina una categoría existente del sistema. Se valida que la categoría no tenga productos asociados antes de permitir la eliminación.' })
    @ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente', type: ModelResponce })
    @ApiResponse({ status: 404, description: 'La categoría no existe' })
    @ApiResponse({ status: 409, description: 'La categoría tiene productos asociados y no puede ser eliminada' })
    EliminarCategoria(@Param("id", ParseIntPipe)id:number){
        return this.CategoriasServices.EliminarCategoria(id);

    }
    @Get("all_categorias")
@Roles(RolesList.ADMIN,RolesList.MESERO)
    @ApiOperation({
        description:"Endpoint para los o el administrador para poder buscar todas las categorias con o sin fintro de busqueda",
        summary:'Endpoint para busqueda de categorias',
        tags:['Categorias']
    })
    @ApiResponse({
        status:'2XX',
        description:'Al conseguir la informacion de las categorias',
        type:ModelResponce
    })
    @ApiQuery(
        {
            name:'categoria',
            type:'string',
            example:'Bebidas frias',
            nullable:true,
            required:false,
        }
    )
    async TraerCategorias(@Query("categoria") categoria:string):Promise<ModelResponce>{
        return await this.CategoriasServices.TraerCategorias(categoria);
    }
    @Patch("modificar_info")
    @ApiOperation({ summary: 'Actualizar información de una categoría', description: 'Actualiza el nombre o descripción de una categoría existente. Los cambios se aplican solo a los campos proporcionados.' })
    @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente', type: ModelResponce })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 404, description: 'La categoría no existe' })
    @ApiResponse({ status: 409, description: 'El nuevo nombre ya existe en otra categoría' })
    ModificarInfo(@Body() data:CategoriasModificarPDO){
        return this.CategoriasServices.ModificarInfo(data)
    }
}