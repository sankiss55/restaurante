import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriaProductoEntitie } from "../entities/categoria.entitie";
import { DetallesOrdenEntitie } from "../entities/detalles_orden.entitie";
import { EstadoOrdenEntitie } from "../entities/estado_orden.entitie";
import { MesasEntitie } from "../entities/mesas.entitie";
import { OrdenEntitie } from "../entities/orden.entitie";
import { ProductosEntitie } from "../entities/productos.entitie";
import { TipoUsuarioEntitie } from "../entities/tipo_usuario.entitie";
import { UsuariosEntitie } from "../entities/usuarios.entitie";

@Module({
    imports:[TypeOrmModule.forRoot({
        type:'postgres',
        database:process.env.POSTGRES_DB,
        username:process.env.POSTGRES_USER,
        password:process.env.POSTGRES_PASSWORD,
        poolSize:Number(process.env.POOL_SIZE),
        host:process.env.HOST_DATABASE,
        port:Number(process.env.PORT_DATBASE),
        entities:[UsuariosEntitie, TipoUsuarioEntitie, CategoriaProductoEntitie, ProductosEntitie, MesasEntitie, EstadoOrdenEntitie, OrdenEntitie, DetallesOrdenEntitie],
        synchronize: true
    })]
})
export class ConfigDataBase{}