import { Module, forwardRef } from "@nestjs/common";
import { OrdenesController } from "./orden.controller";
import { OrdenServices } from "./orden.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdenEntitie } from "src/entities/orden.entitie";
import { MesasModule } from "../mesas/mesas.module";
import { UsuariosModule } from "../usuarios/usuarios.module";
import { EstadoOrdenEntitie } from "src/entities/estado_orden.entitie";
import { DetallesOrdenEntitie } from "src/entities/detalles_orden.entitie";
import { OrdenesGateway } from "src/gateways/ordenes.gateway";

@Module({
    imports:[TypeOrmModule.forFeature([OrdenEntitie, EstadoOrdenEntitie, DetallesOrdenEntitie]), MesasModule, forwardRef(() => UsuariosModule)],
    controllers:[OrdenesController],
    providers:[OrdenServices, OrdenesGateway],
    exports:[OrdenServices, OrdenesGateway]
})
export class OrdenesModule{}