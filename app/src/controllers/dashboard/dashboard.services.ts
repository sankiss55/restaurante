import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DetallesOrdenEntitie } from "src/entities/detalles_orden.entitie";
import { OrdenEntitie } from "src/entities/orden.entitie";
import { ProductosEntitie } from "src/entities/productos.entitie";
import { UsuariosEntitie } from "src/entities/usuarios.entitie";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService{
    constructor(@InjectRepository(OrdenEntitie) private readonly OrdenBD:Repository<OrdenEntitie>, @InjectRepository(ProductosEntitie) private readonly ProductosBD:Repository<ProductosEntitie>, @InjectRepository(DetallesOrdenEntitie) private readonly DetalleOrdenBD:Repository<DetallesOrdenEntitie>,@InjectRepository(UsuariosEntitie) private readonly UsuariosBD:Repository<UsuariosEntitie>){}

    async GetInfoOrdenes(){
       const [Total,AllOrdenes, CantidadOrdenes, OrdenesPorMes]=   await Promise.all([  this.OrdenBD.sum("total"),
         this.OrdenBD.find(),
         this.OrdenBD.count(),
          this.OrdenBD.createQueryBuilder("orden")
                .select("TO_CHAR(orden.created_at, 'Month YYYY')", "mes")
                .addSelect("COUNT(orden.id)", "cantidad_ordenes")
                .addSelect("SUM(orden.total)", "total_mes")
                .where("orden.id_estado = :estado", { estado: 5 })
                .groupBy("TO_CHAR(orden.created_at, 'Month YYYY')")
                .orderBy("mes", "ASC")
                .getRawMany()
        
       ])
       
    return{
     "data":{
        "GananciasTotales":Total,
        "AllOrdenes":AllOrdenes,
        "NumeroTotalDeOrdenes":CantidadOrdenes,
        "OrdenesPorMes":OrdenesPorMes
     }   
    } 
    }
    async GetInfoProductos(){
        const [CantidadProductos, ProductosInfo, CantNoDisponibles,CantDiponible]= await Promise.all([
            this.ProductosBD.count(),
            this.DetalleOrdenBD.createQueryBuilder("ProductoMasVendido").select("ProductoMasVendido.nombre_producto", "Producto").addSelect("SUM(ProductoMasVendido.producto_cantidad)","TotalVendida").groupBy("ProductoMasVendido.nombre_producto").getRawMany(),
            this.ProductosBD.findBy({
                "disponibilidad":false,
            }),
            this.ProductosBD.findBy({
                "disponibilidad":true,
            })
        ])
        return {
            "data":{
                "CantidadDeProductos":CantidadProductos,
                "Productos":ProductosInfo,
                "CantProductDiponibles":CantDiponible,
                "CantProductNoDiponibles":CantNoDisponibles
            }
        }
    }
    async InfoUsuarios(){
        const [CantAdministradores,CantCocineros,CantMeseros]=await Promise.all([
            this.UsuariosBD.count({
                where:{
                    id_tipo:{id:1}
                }
            }),
            this.UsuariosBD.count({
                where:{
                    id_tipo:{id:2}
                }
            }),
            this.UsuariosBD.count({
                where:{
                    id_tipo:{id:3}
                }
            })
        ])
        return {
            "data":{
                "CantAdmin":CantAdministradores,
                "CantMesero":CantMeseros,
                "CantCocinero":CantCocineros
            }
        }
    }
}