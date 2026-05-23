import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { UsuariosEntitie } from "src/entities/usuarios.entitie";
import { UsuariosCreateDTOS, LoguinUsuarios } from "src/dtos/usuarios.dto";
import * as bcrypt from 'bcrypt';
import { ModelResponce } from "src/responces/ModelResponse";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class UsuariosServices {
  constructor(
    @InjectRepository(UsuariosEntitie)
    private readonly Usuarios: Repository<UsuariosEntitie>,
    private readonly JWTServices: JwtService
  ) {}
async BuscarUsuarioById(id:number){
return this.Usuarios.findBy({
  id
});
}
  async CreateUser({ nombre, correo, password, id_tipo }: UsuariosCreateDTOS): Promise<ModelResponce> {
      const BuscarUsuarioExistente=await this.Usuarios.findOneBy({
        correo:correo,
      });
      if(BuscarUsuarioExistente!==null){
        throw new ConflictException("El usuario ya existe con ese correo, porfavor de ingresar otro");
      }
      return await this.Usuarios.manager.transaction(async (TransactionUsuario) => {
        const HashPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const date = new Date();

        await TransactionUsuario.insert(UsuariosEntitie, {
          nombre,
          correo,
          password: HashPassword,
          creation_date: date,
          date_modification: date,
          id_tipo: { id: id_tipo },
          activo: true,
        });

        return {
          status: 'success',
          message: 'Usuario creado exitosamente',
          data: []
        };
      });

    
  }

  async LoginUsuario({correo, password}:LoguinUsuarios):Promise<ModelResponce>{
      const responce=await this.Usuarios.findOne({
        where:{correo:correo},
        relations:['id_tipo']
        
      });
      if(responce==null)
      {
        throw new NotFoundException("El usuario no existe en el sistema");
      }
      const VerificarPassword=bcrypt.compareSync(password,responce.password);
      if(!VerificarPassword){
        throw new UnauthorizedException("La contraseña es incorrecta")
      }
      const payload={
        nombre:responce.nombre,
        rol:responce.id_tipo.tipo,
        correo:responce.correo,
      }
      const dataJWT=await this.JWTServices.signAsync(payload);
      return {
        status:'success',
        message:'login iniciado exitosamente',
        data:{
          CodeJWT:dataJWT,
        }
      }
    
  }

}