import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categoria_producto')
export class CategoriaProductoEntitie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 225, nullable: false, unique: true })
  categoria!: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  descripcion!: string;
}