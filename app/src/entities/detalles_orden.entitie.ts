import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductosEntitie } from "./productos.entitie";
import { OrdenEntitie } from "./orden.entitie";
@Entity('detalles_orden')
export class DetallesOrdenEntitie{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:'double precision', nullable:false})
    sub_total!:number;

    @Column({type:'int', nullable:false})
    producto_cantidad!:number;

    @ManyToOne(() => ProductosEntitie,{nullable:true})
    @JoinColumn({ name: 'id_producto'})
    id_producto!: ProductosEntitie;

    @ManyToOne(()=>OrdenEntitie, { nullable: false })
    @JoinColumn({name:'id_orden'})
    id_orden!:OrdenEntitie;

    @Column({type:'varchar', length:225,nullable:true})
    nota!:string;

    @Column({type:'double precision',nullable:false})
    precio_unitario!:number;

    @Column({type:'varchar', length:225, nullable:false})
    nombre_producto!:string
}