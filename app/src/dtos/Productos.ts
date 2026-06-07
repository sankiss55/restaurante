import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class ProductosCreatePDO{
    @ApiProperty({type:'string', nullable:false, required:true, description:'El nombre que llevara el producto en el sistema',maxLength:225, minLength:2})
    @IsString()
    @IsNotEmpty()
    @MaxLength(225)
    @MinLength(2)
    nombre!:string
    
    @ApiProperty({type:'string', nullable:true, required:false, description:'Los Ingredientes que tiene el platillo',maxLength:225})
    @IsString()
    @IsNotEmpty()
    @MaxLength(225)
    @IsOptional()
    ingredientes?:string

    @ApiProperty({type:'number', nullable:false, required:true, description:'El precio que tendra el producto.'})
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    precio!:number

    @ApiProperty({type:'string', nullable:false, required:true, description:'Nombre de la imagen del producto',maxLength:225, minLength:2})
    @IsString()
    @IsNotEmpty()
    @MaxLength(225)
    @MinLength(2)
    imagen!:string

    @ApiProperty({type:'boolean', nullable:false, required:true, description:'Si el producto esta disponible en el momento.'})
    @IsBoolean()
    @IsNotEmpty()
    disponibilidad!:boolean

    @ApiProperty({type:'number', nullable:false, required:true, description:'El id de la categoria que le pertenece al producto.'})
    @IsPositive()
    @IsInt()
    id_categoria!:number
}

export class ProductosFilterDTO{
    @ApiProperty({example:'Pizza', type:'string', nullable:true, required:false, description:'Buscar por nombre del producto', maxLength:225})
    @IsString()
    @IsOptional()
    @MaxLength(225)
    nombre?:string

    @ApiProperty({example:45.50, type:'number', nullable:true, required:false, description:'Filtrar por precio exacto'})
    @IsNumber()
    @IsOptional()
    @IsPositive()
    precio?:number

    @ApiProperty({example:true, type:'boolean', nullable:true, required:false, description:'Filtrar por disponibilidad'})
    @IsBoolean()
    @IsOptional()
    disponibilidad?:boolean

    @ApiProperty({example:2, type:'integer', nullable:true, required:false, description:'Filtrar por id de categoria'})
    @IsInt()
    @IsOptional()
    @IsPositive()
    id_categoria?:number
}

export class ProductosUpdateDTO{
    @ApiProperty({example:'Pizza Nueva York', type:'string', nullable:true, required:false, description:'Nuevo nombre del producto', maxLength:225, minLength:2})
    @IsString()
    @IsOptional()
    @MaxLength(225)
    @MinLength(2)
    nombre?:string

    @ApiProperty({example:'Tomate, queso, jamón, piña', type:'string', nullable:true, required:false, description:'Nuevos ingredientes del platillo', maxLength:225})
    @IsString()
    @IsOptional()
    @MaxLength(225)
    ingredientes?:string

    @ApiProperty({example:55.00, type:'number', nullable:true, required:false, description:'Nuevo precio del producto'})
    @IsNumber()
    @IsOptional()
    @IsPositive()
    precio?:number

    @ApiProperty({example:'pizza_newyork.jpg', type:'string', nullable:true, required:false, description:'Nuevo nombre de la imagen', maxLength:225, minLength:2})
    @IsString()
    @IsOptional()
    @MaxLength(225)
    @MinLength(2)
    imagen?:string

    @ApiProperty({ example: true, type: 'boolean', nullable: true, required: false })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    disponibilidad?: boolean

    @ApiProperty({example:3, type:'integer', nullable:true, required:false, description:'Nuevo id de categoria'})
    @IsInt()
    @IsOptional()
    @IsPositive()
    id_categoria?:number
}