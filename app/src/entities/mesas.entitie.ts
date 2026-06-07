import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UsuariosEntitie } from "./usuarios.entitie";

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

    @Column({type:'int', nullable:true})
    id_usuario?: number|null;

    @ManyToOne(() => UsuariosEntitie, {nullable:true, onDelete:'SET NULL'})
    @JoinColumn({name:'id_usuario'})
    usuario?: UsuariosEntitie;
}