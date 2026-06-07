import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("estados_orden")
export class EstadoOrdenEntitie{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:'varchar', length:225, nullable:false, unique:true})
    estado!:string;

    @Column({type:'varchar', length:225, nullable:true})
    descripcion!:string;
}