import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MesasEntitie } from "./mesas.entitie";
import { UsuariosEntitie } from "./usuarios.entitie";
import { EstadoOrdenEntitie } from "./estado_orden.entitie";
import { DetallesOrdenEntitie } from "./detalles_orden.entitie";
@Entity("orden")
export class OrdenEntitie{
    @PrimaryGeneratedColumn()
    id!:number;
    
    @Column({nullable:true, type:'varchar', length:225})
    nota!:string;

    @Column({type:'double precision', nullable:false})
    total!:number

    @Column({type:'timestamp without time zone',nullable:true})
    created_at!:Date
    
    @Column({type:'timestamp without time zone',nullable:true})
    updated_at!:Date

    @ManyToOne(()=>MesasEntitie, { nullable: false })
    @JoinColumn({name:'id_mesa'})
    id_mesa!:MesasEntitie

    @ManyToOne(()=>UsuariosEntitie, { nullable: false })
    @JoinColumn({name:'usuario_atencion'})
    usuario_atencion!:UsuariosEntitie

    @ManyToOne(()=>EstadoOrdenEntitie, { nullable: false })
    @JoinColumn({name:'id_estado'})
    id_estado!:EstadoOrdenEntitie

    @OneToMany(() => DetallesOrdenEntitie, (detalles) => detalles.id_orden, { cascade: true })
    detalles!: DetallesOrdenEntitie[];
}