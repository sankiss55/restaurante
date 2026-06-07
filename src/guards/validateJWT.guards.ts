import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import extractJWT from "src/services/extractJWT";

@Injectable()
export class ValidateJWTGuards implements CanActivate{
    constructor(private readonly JWTservice:JwtService){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
            const response=context.switchToHttp().getRequest<Request>();
            const data=response.headers['authorization'];
            if (!data) {
            throw new UnauthorizedException("No se proporcionó un token de autenticación");
        }
            const JWT_code=extractJWT(data);
            const payloand=await this.JWTservice.verifyAsync(JWT_code);
            console.error(payloand);
            response["user"]=payloand;
            return true;
    }
}