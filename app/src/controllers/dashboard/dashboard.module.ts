import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdenEntitie } from "src/entities/orden.entitie";
import { DashboardService } from "./dashboard.services";
import { DashboardController } from "./dashboard.controller";
import { ProductosEntitie } from "src/entities/productos.entitie";
import { DetallesOrdenEntitie } from "src/entities/detalles_orden.entitie";
import { UsuariosEntitie } from "src/entities/usuarios.entitie";

@Module({
    imports:[TypeOrmModule.forFeature([OrdenEntitie, ProductosEntitie,DetallesOrdenEntitie, UsuariosEntitie])],
    providers:[DashboardService],
    controllers:[DashboardController]
})
export class DashboardModule{}