import { BadRequestException, ConflictException, HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MesasEntitie } from "src/entities/mesas.entitie";
import { IsNull, Repository, Transaction } from "typeorm";
import { MesasCreateDTOS } from "src/dtos/mesas";
import { ModelResponce } from "src/responces/ModelResponse";
import { isEmpty } from "class-validator";
@Injectable()
export class MesasService{
    constructor(@InjectRepository(MesasEntitie) private readonly MesasService:Repository<MesasEntitie>){}

    public BuscarMesaById(id:number){
        return this.MesasService.findBy({
            id
        });
    }
    async CreateMesa({numero_de_mesa}:MesasCreateDTOS):Promise<ModelResponce>{
            const BuscarMesa=await this.MesasService.findOneBy({
                numero_mesa:numero_de_mesa
            });
            if(BuscarMesa!==null){
                throw new ConflictException("La mesa ya existe, porfavor de ingresar un numero de mesa no existente");
            }
             return this.MesasService.manager.transaction("SERIALIZABLE",async (transactionMesas)=>{
               const response=await transactionMesas.insert(MesasEntitie,{
                numero_mesa:numero_de_mesa,
                atendida:false,
                });
                if(response.raw==0){
                   throw new ConflictException("No se pudo crear una nueva mesa, intentalo mas tarde.");
                }
                return {
                    status:'success',
                    message:"La mesa se creo correctamente",
                    data:null,
                }
            })
    }
    async Atendida_Desocupada_Mesa(id_mesa:number, ADM:boolean):Promise<ModelResponce>{
            const response=await this.MesasService.findOneBy( {
                id:id_mesa
            })
            if(response===null)
            {
                throw new ConflictException("La mesa no existe, porfavor de verificar.");
            }
            return await this.MesasService.manager.transaction("SERIALIZABLE", async (TransactionMesas)=>{
                const data=await TransactionMesas.update(MesasEntitie, id_mesa,{
                    atendida:ADM
                })
                if(data.affected==0){
                throw new ConflictException("No se pudo desactivar la mesa, intentalo mas tarde.")
                }
                return {
                    status:'success',
                    message:`La Mesa se ha cambiado de estado a: ${ADM?"Atendida": "Desocupada"}`,
                    data:null
                }
            });
        
    }


    async CambiarEstadoActvo(id_mesa:number):Promise<ModelResponce>{
const MesaEncontrada=await this.MesasService.findOneBy({
            id:id_mesa
        });
        if(MesaEncontrada===null){
            throw new NotFoundException("La mesa no se encontro en el sistema, verifique de nueva cuenta  ");
        }
        return this.MesasService.manager.transaction("SERIALIZABLE",async (transactionMesa)=>{
            const response=await transactionMesa.update(MesasEntitie, id_mesa, {
                activo:!MesaEncontrada.activo
            });
            if(response.affected==0){
                throw new ConflictException("No se pudo cambiar el estado de la mesa,  porfavor intentalo mas tarde.");
            }
            return {
                status:'success',
                message:'Se ha modificado el estado de la mesa exitosamente',
                data:null
            }
        })
        
    }
    async TraerAllMesas(filtro:string):Promise<MesasEntitie[]>{
        if(isEmpty(filtro)){
            return await this.MesasService.find();
        }
        const data=filtro.toLowerCase().trim();
        if('desactivado'!==data&& data!=='activado'){
            throw new ConflictException("La opcion de filtro no existe, verifica de nueva cuenta la opcion.");
        }
        return await this.MesasService.findBy({
            activo:"activado"===data?true:false
        });
    }

    async AsignarMesaAlMesero(idMesa: number, idUsuario: number): Promise<ModelResponce> {
        const mesa = await this.MesasService.findOneBy({ id: idMesa });
        if (!mesa) {
            throw new NotFoundException("La mesa no existe");
        }

        return this.MesasService.manager.transaction("SERIALIZABLE", async (transaction) => {
            const result = await transaction.update(MesasEntitie, idMesa, {
                id_usuario: idUsuario,
                atendida: true
            });

            if (result.affected === 0) {
                throw new ConflictException("No se pudo asignar la mesa");
            }

            return {
                status: 'success',
                message: `Mesa asignada al mesero`,
                data: null
            };
        });
    }

    async DesasignarMesa(idMesa: number): Promise<ModelResponce> {
        const mesa = await this.MesasService.findOneBy({ id: idMesa });
        if (!mesa) {
            throw new NotFoundException("La mesa no existe");
        }

        return this.MesasService.manager.transaction("SERIALIZABLE", async (transaction) => {
            const result = await transaction.update(MesasEntitie, idMesa, {
                id_usuario: null,
                atendida: false
            });

            if (result.affected === 0) {
                throw new ConflictException("No se pudo desasignar la mesa");
            }

            return {
                status: 'success',
                message: `Mesa desasignada`,
                data: null
            };
        });
    }

    async ObtenerMesasPorMesero(idUsuario: number):  Promise<ModelResponce> {
          const data=await this.MesasService.find({
  where: [
    { id_usuario: IsNull(), activo: true },  
    { id_usuario: idUsuario, activo: true }, 
  ],
  relations: ['usuario']
});
return{
    data:data,
    message:"Mesas extraidas",
    status:'success'
}
    }

    async ObtenerMesasDisponibles(): Promise<MesasEntitie[]> {
        return this.MesasService.find({
            where: { atendida: false, activo: true }
        });
    }

    async DesocuparMesa(idMesa: number): Promise<void> {
        await this.MesasService.update(idMesa, {
            atendida: false
        } as any);
    }
    
}