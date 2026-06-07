
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class OrdenCreatePDO{
    @ApiProperty({example:'Orden con ingredientes especiales', type:'string', nullable:true, required:false, description:'Nota adicional para la orden', maxLength:225})
    @IsString()
    @IsOptional()
    @MaxLength(225)
    nota?:string;

    @ApiProperty({example:125.75, type:'number', nullable:false, required:true, description:'El total de la orden'})
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    total!:number;

    @ApiProperty({example:4, type:'integer', nullable:false, required:true, description:'El id de la mesa donde se toma la orden'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id_mesa!:number;

    @ApiProperty({example:2, type:'integer', nullable:false, required:true, description:'El id del usuario (mesero/atendedor) que atiende la orden'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    usuario_atencion!:number;

    @ApiProperty({example:1, type:'integer', nullable:false, required:true, description:'El id del estado inicial de la orden (ej: 1 = Pendiente)'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id_estado!:number;
}

export class DetalleOrdenItemDTO{
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

    @ApiProperty({example:'Pizza Margherita', type:'string', nullable:false, required:true, description:'El nombre del producto en este detalle', maxLength:225})
    @IsString()
    @IsNotEmpty()
    @MaxLength(225)
    nombre_producto!:string;
}

export class OrdenConDetallesDTO{
    @ApiProperty({example:'Orden con ingredientes especiales', type:'string', nullable:true, required:false, description:'Nota adicional para la orden', maxLength:225})
    @IsString()
    @IsOptional()
    @MaxLength(225)
    nota?:string;

    @ApiProperty({example:125.75, type:'number', nullable:false, required:true, description:'El total de la orden'})
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    total!:number;

    @ApiProperty({example:4, type:'integer', nullable:false, required:true, description:'El id de la mesa donde se toma la orden'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id_mesa!:number;

    @ApiProperty({example:2, type:'integer', nullable:false, required:true, description:'El id del usuario (mesero/atendedor) que atiende la orden'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    usuario_atencion!:number;

    @ApiProperty({example:1, type:'integer', nullable:false, required:true, description:'El id del estado inicial de la orden (ej: 1 = Pendiente)'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id_estado!:number;

    @ApiProperty({type: 'array', items: {type: 'object'}, nullable:false, required:true, description:'Array de detalles de la orden'})
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({each: true})
    @Type(()=>DetalleOrdenItemDTO)
    detalles!:DetalleOrdenItemDTO[];
}

export class CambiarEstadoOrdenDTO{
    @ApiProperty({example:3, type:'integer', nullable:false, required:true, description:'El nuevo estado de la orden (2=Preparando, 3=Listo, 5=Pagado)'})
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id_estado!:number;
}