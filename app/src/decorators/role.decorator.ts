import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ValidateJWTGuards } from "src/guards/validateJWT.guards";
import { ValidateRoleGuards } from "src/guards/validate_role.guards";
export enum RolesList{
    ADMIN='Admin',
    COCINERO='Cocinero',
    MESERO='Mesero'
}
export const Roles=(...roles:RolesList[])=>{
    return applyDecorators(
        ApiBearerAuth(),
        SetMetadata(process.env.KEY_ROLES,roles),
        UseGuards(ValidateJWTGuards,ValidateRoleGuards )
    )
}