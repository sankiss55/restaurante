
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

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