import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { Response, Request } from "express";
import { ExceptionsResponse } from "src/responces/ExceptionsResponces";
@Catch(JsonWebTokenError,TokenExpiredError, NotBeforeError)
export class JWTExceptionFilter implements ExceptionFilter{
    catch(exception: JsonWebTokenError| TokenExpiredError| NotBeforeError, host: ArgumentsHost) {
        const context=host.switchToHttp();
        const response=context.getResponse<Response>();
        const request=context.getRequest<Request>();
        let typeError='Token invalido';
        const status= HttpStatus.UNAUTHORIZED;
        if(exception instanceof JsonWebTokenError){
            typeError="Token invalido o mal formado";
        }
        if(exception instanceof TokenExpiredError){
            typeError="El token ya expiro";
        }
        if(exception instanceof NotBeforeError){
            typeError="El token no es valido."
        }
        response.status(status).json({
            code:status,
            status:'error',
            message:typeError,
            error:exception,
            path:request.url,
            timestamp: new Date().toISOString()
        })
    }
}