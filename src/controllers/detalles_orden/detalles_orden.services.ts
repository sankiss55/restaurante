import { InjectRepository } from "@nestjs/typeorm";
import { DetallesOrdenesCreateDTO } from "src/dtos/detalles_ordenes";
import { DetallesOrdenEntitie } from "src/entities/detalles_orden.entitie";
import { Repository } from "typeorm";
import { OrdenServices } from "../orden/orden.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ModelResponce } from "src/responces/ModelResponse";

@Injectable()
export class DetallesOrdenesService{
    constructor(@InjectRepository(DetallesOrdenEntitie) private readonly DestallesOrdenesBD:Repository<DetallesOrdenEntitie>, private readonly OrdenServices:OrdenServices){}

    async CrearDetalle({sub_total,producto_cantidad,nota, precio_unitario,id_orden,nombre_producto,id_producto}:DetallesOrdenesCreateDTO):Promise<ModelResponce>{
        if((await this.OrdenServices.BuscarOrdenById(id_orden)).length==0) throw new NotFoundException("La orden no existe.");
        return this.DestallesOrdenesBD.manager.transaction("SERIALIZABLE", async(transactionDetalles)=>{
            transactionDetalles.insert(DetallesOrdenEntitie,{
                sub_total,
                producto_cantidad, 
                nota, 
                precio_unitario,
                id_producto:{id:id_producto}, 
                id_orden:{id:id_orden}, nombre_producto,
            });
            return {
                status:'success',
                data:[],
                message:"La orden se ha creado exitosamente."
            }
        });
    }

}