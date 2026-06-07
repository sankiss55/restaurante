import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoriaProductoEntitie } from "./categoria.entitie";
@Entity("productos")
export class ProductosEntitie{
    @PrimaryGeneratedColumn()
    id!:number;
    
    @Column({type:'varchar', length:225, nullable:false})
    nombre!:string;

    @Column({type:'text', nullable:true})
    ingredientes!:string;
    
    @Column({type:'double precision', nullable:false})
    precio!:number;
    
    @Column({type:'varchar',length:225, nullable:false})
    imagen!:string;

    @Column({type:'boolean', nullable:false})
    disponibilidad!:boolean;

    @ManyToOne(()=> CategoriaProductoEntitie, { nullable: true })
    @JoinColumn({name:'id_categoria'})
    id_categoria!:CategoriaProductoEntitie;

    @Column({type:'timestamp with time zone', nullable:true})
    creation_date!:Date;

    @Column({type:'timestamp with time zone', nullable:true})
    date_modification!:Date;
}