import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response, Request } from "express";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class PostgresExceptionFilter implements ExceptionFilter{
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const context= host.switchToHttp();
        const request=context.getRequest<Request>();
        const response=context.getResponse<Response>();
        const status=HttpStatus.BAD_REQUEST;
        let message="Error en la base de datos";
        let code=(exception as any).code;
        if(exception instanceof QueryFailedError){
            message=this.FindCode(code)
        }
        response.status(status).json({
            status:'error',
             statusCode: status,
              message,
              error:exception,
              code:code,
              path: request.url,
            });
    }
    FindCode(code:string):string{
        switch(code){
            // Integridad de datos
            case '23505': 
                return "La primary key está duplicada, revisa la inserción de dato.";
            case '23503': 
                return "Violación de clave foránea. El valor referenciado no existe en la tabla relacionada.";
            case '23502': 
                return "Violación de restricción NOT NULL. El campo no puede estar vacío.";
            case '23514': 
                return "Violación de restricción CHECK. El valor no cumple con las condiciones establecidas.";
            case '23001': 
                return "Violación de restricción RESTRICT. No se puede eliminar este registro por tener dependencias.";
            
            // Sintaxis y definiciones
            case '42P01': 
                return "La tabla especificada no existe en la base de datos.";
            case '42703': 
                return "La columna especificada no existe en la tabla.";
            case '42883': 
                return "La función especificada no existe.";
            case '42P07':
                return "La tabla ya existe en la base de datos.";
            
            // Conexión
            case '08006': 
                return "Error de conexión a la base de datos. La conexión fue cerrada inesperadamente.";
            case '08003': 
                return "La conexión con la base de datos no existe.";
            case '08000':
                return "Error de conexión general con la base de datos.";
            
            // Autenticación
            case '28P01': 
                return "Contraseña o credenciales de autenticación inválidas.";
            case '28000':
                return "Error de autenticación. Verifica tus credenciales.";
            
            // Datos
            case '22012': 
                return "Error matemático: División por cero.";
            case '22005': 
                return "Error en asignación de datos. El tipo de dato no es compatible.";
            case '22001':
                return "El valor es demasiado largo para el tipo de dato especificado.";
            case '22003':
                return "El valor numérico está fuera del rango permitido.";
            
            // Transacciones
            case '40001': 
                return "Error de serialización. Intenta de nuevo la operación.";
            case '40P01':
                return "Deadlock detectado. Dos transacciones están esperando una a la otra.";
            
            // Permisos
            case '42501': 
                return "Permiso denegado. No tienes autorización para realizar esta operación.";
            
            // Base de datos
            case '3D000':
                return "La base de datos especificada no existe.";
            case '3F000':
                return "El esquema especificado no existe.";
            
            default: 
                return `Error en la base de datos (Código: ${code}). Contacta al administrador si el problema persiste.`;
        }
    }
}