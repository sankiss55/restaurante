import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { UsuariosServices } from "./usuarios.service";
import { UsuariosCreateDTOS, LoguinUsuarios } from "src/dtos/usuarios.dto";
import { ModelResponce } from "src/responces/ModelResponse";
import { Roles, RolesList } from "src/decorators/role.decorator";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";

@Controller("usuarios")
@ApiTags("Usuarios")
@ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Error de validación en los datos enviados', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.CONFLICT, description: 'Conflicto: el email ya está registrado o el tipo de usuario no existe', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'Credenciales incorrectas o sin autorización', type: ExceptionsResponse})
@ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor', type: ExceptionsResponse})
export class UsuariosController{
    constructor(private readonly UsuariosServices:UsuariosServices ){}
    @Post("/CreateUser")
    @Roles(RolesList.ADMIN)
    @ApiResponse({
        status:'2XX',
        description:'Respuesta cuando se crea exitosamente a un nuevo usuario dentro del sistema.',
        type:ModelResponce,
    })
    @ApiOperation({
        description:'Endpoint donde el o los administradores podran crear nuevos usuarios de los tipos disponibles dentro de la base de datos.',
        summary:'Endpoint para crear nuevos usuarios dentro del sistema.',
        tags:['Usuarios']
    })
    CreateUser(@Body() DataUser:UsuariosCreateDTOS):Promise<ModelResponce>{
        return this.UsuariosServices.CreateUser(DataUser)
    }

    @ApiResponse({
        status:'2XX',
        description:'Respuesta cuando se inicia sesión exitosamente.',
        schema:{
            example:{
                status:'success',
                message:'login iniciado exitosamente.',
                data:{CodeJWT:'123dnskke'}
            },
        },
    })
    @ApiOperation({
        description:'Endpoint para poder acceder al sistema con su correo y contraseña establecida.',
        summary:'Endpoint para inicio de sesión.',
        tags:['Usuarios']
    })
    @Post("/login")
    login(@Body() data: LoguinUsuarios){
        return this.UsuariosServices.LoginUsuario(data)
    }

    @Roles(RolesList.ADMIN)
    @Get()
    async AllUsuarios():Promise<ModelResponce>{
        const data=await this.UsuariosServices.AllUsuarios();
        return {
            status:'success',
            data:data,
            message:"Los usuarios se encontraron exitosamente."
        }
    }
}