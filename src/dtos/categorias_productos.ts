import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CategoriasProductosDTO{
    @ApiProperty({example:"postres", type:'string', required:true, nullable:false, description:'El nombre de la nueva categoria para los productos que habla en el sistema. '})
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(225)
    categoria!:string

    @ApiProperty({example:"Productos que entran en la categoria de  postres", type:'string', required:false, nullable:false, description:'El la pequeña descripcion de lo que consiste la categoria. '})
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(225)
    @IsOptional()
    descripcion?:string

}

export class CategoriasModificarPDO{
    @ApiProperty({example:1, type:'number', nullable:false, required:true, description:'El id que tiene actualmente registrado en la base de datos.'})
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @IsOptional()
    id?:number
    
    @ApiProperty({example:"postres", type:'string', required:false, nullable:false, description:'El nombre de la nueva categoria para los productos que habla en el sistema. '})
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(225)
    @IsOptional()
    categoria?:string

    @ApiProperty({example:"Productos que entran en la categoria de  postres", type:'string', required:true, nullable:false, description:'El la pequeña descripcion de lo que consiste la categoria. '})
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(225)
    @IsOptional()
    descripcion?:string

}
