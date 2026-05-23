import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mesas")
export class MesasEntitie{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({unique:true, nullable:false, type:'int'})
    numero_mesa!:number;

    @Column({type:'boolean',nullable:false})
    atendida!:boolean;

    @Column({type:'boolean', default:true,nullable:false})
    activo!:boolean;
}