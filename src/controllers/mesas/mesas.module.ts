import { Module } from "@nestjs/common";
import { MesasController } from "./mesas.controller";
import { MesasService } from "./mesas.services";
import { MesasEntitie } from "src/entities/mesas.entitie";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
    imports:[TypeOrmModule.forFeature([MesasEntitie])],
    controllers:[MesasController],
    providers:[MesasService],
    exports:[MesasService]
})
export class MesasModule{}