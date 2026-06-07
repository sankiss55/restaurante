import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductosEntitie } from "src/entities/productos.entitie";
import { ProductosServces } from "./productos.services";
import { ProductosController } from "./productos.controller";
import { CategoriaProductosModule } from "../categorias_productos/categorias.module";

@Module({
    imports:[TypeOrmModule.forFeature([ProductosEntitie]), CategoriaProductosModule],
    controllers:[ProductosController],
    providers:[ProductosServces]
})
export class ProductosModule{}