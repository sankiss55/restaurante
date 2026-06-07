import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesList } from "src/decorators/role.decorator";
@Injectable()
export class ValidateRoleGuards implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean  {
        const requesRoles=this.reflector.getAllAndOverride<RolesList[]>(process.env.KEY_ROLES,[
            context.getHandler(),
            context.getClass()
        ]);
        if (!requesRoles) {
      return true;
    }
    const reques=context.switchToHttp().getRequest();
    const user=reques["user"];
    if (!user || !user.rol) {
            throw new ForbiddenException("No tienes permisos para acceder a este recurso (Usuario no identificado)");
        }
    const hasRole = requesRoles.includes(user.rol);

        if (!hasRole) {
            throw new ForbiddenException("No tienes el rol requerido para realizar esta acción");
        }

        return true;
    }

}