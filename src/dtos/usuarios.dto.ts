import { ApiProperty } from "@nestjs/swagger";
import {  IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class UsuariosCreateDTOS{
    @ApiProperty({example:"Santiago", type:'string', description:"Nombre que tendra en el sistema el usuario", required:true, nullable:false, maxLength:225, minLength:2 })
    @IsString()
    @MaxLength(225)
    @MinLength(2)
    @IsNotEmpty()
    nombre!:string

    @ApiProperty({example:"SanSan123$%", type:'string', description:"La contraseña que el usuario con la que podra acceder al sistema", required:true, nullable:false, maxLength:25, minLength:8 })
    @IsString()
    @MaxLength(25)
    @MinLength(8)
    @IsNotEmpty()
    password!:string

    @ApiProperty({example:"santiago@gmail.com", type:'string', description:"El correo el cual tendra el usuario para poder acceder al sistema", required:true, nullable:false, maxLength:225, minLength:6 })
    @IsEmail()
    @MaxLength(225)
    @MinLength(6)
    @IsNotEmpty()
    correo!:string

    @ApiProperty({example:1, type:'integer', description:"El id del tipo de usuario que sera.", required:true, nullable:false, })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    id_tipo!:number
}

export class LoguinUsuarios{
    @ApiProperty({example:"tania@gmail.com", description:'El correo con el que se registro el usuario', required:true, nullable:false, type:'string'})
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @MaxLength(225)
    correo!:string

    @ApiProperty({example:"Tania12@%", description:"La contraseña con la que se uso para poder registrar al usuario", required:true, nullable:false, type:'string'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(22)
    @MinLength(8)
    password!:string
}