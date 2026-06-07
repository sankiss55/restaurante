import { Module } from "@nestjs/common";
import { OrdenesController } from "./orden.controller";
import { OrdenServices } from "./orden.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdenEntitie } from "src/entities/orden.entitie";
import { MesasModule } from "../mesas/mesas.module";
import { UsuariosModule } from "../usuarios/usuarios.module";
import { EstadoOrdenEntitie } from "src/entities/estado_orden.entitie";

@Module({
    imports:[TypeOrmModule.forFeature([OrdenEntitie, EstadoOrdenEntitie]), MesasModule,UsuariosModule],
    controllers:[OrdenesController],
    providers:[OrdenServices],
    exports:[OrdenServices]
})
export class OrdenesModule{}