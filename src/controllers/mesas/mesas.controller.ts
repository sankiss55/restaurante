import { Body, Controller, Get, HttpStatus, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Patch, Query } from "@nestjs/common";
import { MesasService } from "./mesas.services";
import { MesasCreateDTOS } from "src/dtos/mesas";
import { RolesList, Roles } from "src/decorators/role.decorator";
import { ApiBody, ApiDefaultResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ModelResponce } from "src/responces/ModelResponse";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";
import { MesasEntitie } from "src/entities/mesas.entitie";
@Controller("mesas")
@ApiTags("Mesas")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.NOT_FOUND, description: 'La mesa no existe', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor', type: ExceptionsResponse})
export class MesasController{
    constructor(private readonly MesasService:MesasService){}
    ////@Roles(RolesList.ADMIN)
    @Post("crearMesas")
    @ApiResponse({
    status: 201,
    description: "Mesa creada exitosamente",
    type: ModelResponce
})
@ApiOperation({
    summary:"Endpoin para crear nuevas mesas.",
    description:"Endpoind donde el o los administradores podran crear nuevas mesas que vayan a estar disponibles para los comensales.",
    tags:['Mesas']
})
    crear_mesa(@Body() data:MesasCreateDTOS ){
        return this.MesasService.CreateMesa(data);
    }

    @Roles(RolesList.MESERO)
    @Patch("estado_atendida/:id")
    @ApiResponse({
        description:"Respuesta cuando se cambia el estado de la mesa a 'Atendida' o 'desocupada' (true o false).",
        status:'2XX',
        type:ModelResponce,
    })
    @ApiOperation({
        description:"Endpoint que podra utilizar los meseros para poder cambiar el estado de la mesa dependiendo si esta desocupada o esta siendo atendida.",
        summary:'Endpoint para poder cambiar el estado de la mesa (Atendida o Desocupada).',
        tags:['Mesas']
    })
    @ApiBody({
        schema:{
            example:{
                id:1,
                valor:true
            }
        }
    })
    CambiarEstadoAtenida(@Body("id", ParseIntPipe) id:number, @Body("valor", ParseBoolPipe) valor:boolean){
        return this.MesasService.Atendida_Desocupada_Mesa(id, valor);
    }

    //@Roles(RolesList.ADMIN)
    
    @Patch("modificar_estado/:id")
     @ApiResponse({
        description:"Respuesta cuando se desactiva una mesa existente.",
        status:'2XX',
        type:ModelResponce,
    })
    @ApiOperation({
        description:"Endpoint que podra utilizar el o los administradores para poder desactivar mesas que ya no esten disponibles para los comensales.",
        summary:'Endpoint para poder desacartivar una mesa existente.',
        tags:['Mesas']
    })
    async modificarEstado(@Param('id', ParseIntPipe) id:number):Promise<ModelResponce>{
        return await this.MesasService.CambiarEstadoActvo(id);
    }

    @ApiOperation({
        summary:"Endpoint para traer las mesas dependiendo el filtro.",
        description:"Endpoint para el o los administradores para traer todas las mesas dependiendo el filtro",
        tags:['Mesas']
    })
    @Get("traer_mesas")
    @ApiQuery({name:'filtro',
        type:String,
        enum:['activado','desactivado'],
        example:"activado",
        description: 'Filtrar mesas por estado activo/inactivo',
        nullable:true,
        required:false
    })
    async TraerAllMesas(@Query('filtro') filtro:string):Promise<MesasEntitie[]>{
        return await this.MesasService.TraerAllMesas(filtro);
    }
}