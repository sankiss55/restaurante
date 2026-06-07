import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrdenCreatePDO } from "src/dtos/orden";
import { OrdenEntitie } from "src/entities/orden.entitie";
import { Repository } from "typeorm";
import { MesasService } from "../mesas/mesas.services";
import { EstadoOrdenEntitie } from "src/entities/estado_orden.entitie";
import { UsuariosServices } from "../usuarios/usuarios.service";
import { ModelResponce } from "src/responces/ModelResponse";

@Injectable()
export class OrdenServices{
    constructor(@InjectRepository(OrdenEntitie) private readonly OrdenBD:Repository<OrdenEntitie>, private readonly MesasService:MesasService, @InjectRepository(EstadoOrdenEntitie) private readonly EstadosOrden:Repository<EstadoOrdenEntitie>, private readonly UsuariosService:UsuariosServices){}
    async BuscarOrdenById(id:number){
        return this.OrdenBD.findBy({
            id
        })

    }
    async CrearOrden({nota, total, id_mesa, usuario_atencion,id_estado,}:OrdenCreatePDO):Promise<ModelResponce>{
        const BuscarMesa= await this.MesasService.BuscarMesaById(id_mesa);
        const BuscarEstado=await this.EstadosOrden.findBy({
            id:id_estado
        });
        const UsuariosResponse=await this.UsuariosService.BuscarUsuarioById(usuario_atencion);
        if(UsuariosResponse.length===0){
            throw new NotFoundException("El usuario no existe.")
        }
        if(BuscarEstado.length===0){
            throw new NotFoundException("El estado ingresado no existe.")
        }
        if(BuscarMesa.length===0){
            throw new NotFoundException("La mesa ingresada no existe.")
        }
        if(BuscarMesa[0].activo==false){
            throw new ConflictException("No se puede asignar una orden a esta mesa, ya que esta desactivada.");
        }
        const date=new Date();
        return this.OrdenBD.manager.transaction("SERIALIZABLE", async(transactionOrden)=>{
            transactionOrden.insert(OrdenEntitie,{
                nota,total,
                created_at:date,
                updated_at:date,
                id_mesa:{id:id_mesa},
                usuario_atencion:{id:usuario_atencion},
                id_estado:{id:id_estado}
            });
            
        this.MesasService.Atendida_Desocupada_Mesa(id_mesa, true);
            return {
                status:'success',
                data:[],
                message:"La orden se ha creado exitosamente."
            }
        });
    }
}