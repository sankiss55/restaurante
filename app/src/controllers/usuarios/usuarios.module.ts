import { Module } from "@nestjs/common";
import { UsuariosController } from "./usuarios.controlles";
import { UsuariosServices } from "./usuarios.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuariosEntitie } from "src/entities/usuarios.entitie";
@Module({
    imports:[TypeOrmModule.forFeature([UsuariosEntitie])],
    controllers:[UsuariosController],
    providers:[UsuariosServices],
    exports:[UsuariosServices]
})
export class UsuariosModule{}