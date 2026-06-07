import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipousuario')
export class TipoUsuarioEntitie{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:'varchar', length:225, nullable:false, unique:true})
    tipo!:string

    
    @Column({type:'varchar', length:225, nullable:true})
    descripcion!:string
}