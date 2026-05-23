
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class DetallesOrdenesCreateDTO{
    @ApiProperty({example:45.50, type:'number', nullable:false, required:true, description:'El subtotal del detalle (cantidad × precio unitario)'})
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    sub_total!:number;

    @ApiProperty({example:2, type:'integer', nullable:false, required:true, description:'La cantidad de productos en este detalle'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    producto_cantidad!:number;

    @ApiProperty({example:'Sin picante', type:'string', nullable:true, required:false, description:'Nota adicional para el detalle (ej: Sin picante, sin cebolla)', maxLength:225})
    @IsString()
    @IsOptional()
    @MaxLength(225)
    nota?:string;

    @ApiProperty({example:22.75, type:'number', nullable:false, required:true, description:'El precio unitario del producto en este detalle'})
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    precio_unitario!:number;

    @ApiProperty({example:5, type:'integer', nullable:false, required:true, description:'El id del producto en este detalle'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id_producto!:number;

    @ApiProperty({example:3, type:'integer', nullable:false, required:true, description:'El id de la orden a la que pertenece este detalle'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id_orden!:number;

    @ApiProperty({example:'Pizza Margherita', type:'string', nullable:false, required:true, description:'El nombre del producto en este detalle', maxLength:225})
    @IsString()
    @IsNotEmpty()
    @MaxLength(225)
    nombre_producto!:string;
}