import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty,IsPositive } from "class-validator";

export class MesasCreateDTOS{
    @ApiProperty({example:1,description:"El numero de indentificacion que le pertenece a la mesa en el restaurante", required:true, nullable:false, type:'number'})
    @IsInt({message:"El numero debe que ser positivo entero."})
    @IsPositive()
    @IsNotEmpty()
    numero_de_mesa!:number
}

