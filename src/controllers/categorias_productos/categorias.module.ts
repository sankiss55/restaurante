import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriaProductoEntitie } from "src/entities/categoria.entitie";
import { CategoriasController } from "./categorias.controller";
import { CategoriasServices } from "./categorias.services";
import { ProductosEntitie } from "src/entities/productos.entitie";
@Module({
    imports:[TypeOrmModule.forFeature([CategoriaProductoEntitie, ProductosEntitie])],
    controllers:[CategoriasController],
    providers:[CategoriasServices], 
    exports:[CategoriasServices]
})
export class CategoriaProductosModule{}