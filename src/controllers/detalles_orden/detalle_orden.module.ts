import { Module } from "@nestjs/common";
import { DetallesOrdenesController } from "./detalles_orden.controller";
import { DetallesOrdenesService } from "./detalles_orden.services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetallesOrdenEntitie } from "src/entities/detalles_orden.entitie";
import { OrdenesModule } from "../orden/orden.module";

@Module({
    imports:[TypeOrmModule.forFeature([DetallesOrdenEntitie]),OrdenesModule],
    controllers:[DetallesOrdenesController],
    providers:[DetallesOrdenesService],
})
export class DetallesOrdenModule{}