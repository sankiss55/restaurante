import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoUsuarioEntitie } from './tipo_usuario.entitie';

@Entity('usuarios')
export class UsuariosEntitie{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:'varchar', length:225, nullable:false})
    nombre!:string

    @Column({type:'varchar', length:225, nullable:false})
    password!:string

    @Column({type:'varchar', length:225, nullable:false, unique:true})
    correo!:string

    @Column({type:'timestamp', nullable:true})
    creation_date!:Date

    @Column({type:'timestamp', nullable:true})
    date_modification!:Date

    @ManyToOne(() => TipoUsuarioEntitie, { nullable: false })
    @JoinColumn({ name: 'id_tipo' })
    id_tipo!:TipoUsuarioEntitie
    
    @Column({type:'boolean', nullable:false, default:true})
    activo!:boolean
}