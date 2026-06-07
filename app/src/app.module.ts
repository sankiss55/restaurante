import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigDataBase } from './configs/database.config';
import { UsuariosModule } from './controllers/usuarios/usuarios.module';
import { JWT_CONFIG } from './configs/jwt.config';
import { MesasModule } from './controllers/mesas/mesas.module';
import { CategoriaProductosModule } from './controllers/categorias_productos/categorias.module';
import { ProductosModule } from './controllers/productos/productos.module';
import { DetallesOrdenModule } from './controllers/detalles_orden/detalle_orden.module';
import { OrdenesModule } from './controllers/orden/orden.module';

@Module({
  imports: [ConfigDataBase, JWT_CONFIG, UsuariosModule, MesasModule, CategoriaProductosModule, ProductosModule, DetallesOrdenModule, OrdenesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
